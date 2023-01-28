import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

export class HarvestDepositJob {
  public JobParameters: HarvestDepositJobParameters;
  public constructor(JobParameters: HarvestDepositJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    Object.entries(Memory.queues.jobQueue)
      .filter(
        ([, jobMemory]) =>
          jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
          jobMemory.jobParameters.depositId === this.JobParameters.depositId
      )
      .forEach(([jobUUID, jobMemory]) => {
        if (jobMemory.index > count) {
          this.deleteJob(jobUUID);
        }
      });
    if (count === 1) {
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.depositId}-1`);
      this.createJob(UUID, 1);
    } else {
      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.depositId}-${iterations}`);
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Creating "HarvestDepositJob" for Deposit ID: "${this.JobParameters.depositId}" with the UUID "${UUID}"`
      );
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "working",
          spawnRoom: this.JobParameters.spawnRoom,
          room: this.JobParameters.room,
          jobType: "harvestDeposit",
          depositId: this.JobParameters.depositId,
          storage: this.JobParameters.storage
        },
        index,
        room: this.JobParameters.room,
        jobType: "harvestDeposit",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Deleting  "HarvestDepositJob" for Deposit ID: "${this.JobParameters.depositId}" with the UUID "${UUID}"`
      );
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
