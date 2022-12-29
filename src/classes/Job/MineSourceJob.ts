import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

export class MineSourceJob {
  public JobParameters: MineSourceJobParameters;
  public constructor(JobParameters: MineSourceJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    Object.entries(Memory.queues.jobQueue)
      .filter(
        ([, jobMemory]) =>
          jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
          jobMemory.jobParameters.sourceId === this.JobParameters.sourceId
      )
      .forEach(([jobUUID, jobMemory]) => {
        if (jobMemory.index > count) {
          this.deleteJob(jobUUID);
        }
      });
    if (count === 1) {
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.sourceId}-1`);
      this.createJob(UUID, 1);
    } else {
      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.sourceId}-${iterations}`);
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Creating "MineSourceJob" for Source ID: "${this.JobParameters.sourceId}" with the UUID "${UUID}"`
      );
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "fetchingResource",
          spawnRoom: this.JobParameters.spawnRoom,
          room: this.JobParameters.room,
          jobType: "mineSource",
          sourceId: this.JobParameters.sourceId
        },
        index,
        room: this.JobParameters.room,
        jobType: "mineSource",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Deleting  "MineSourceJob" for Source ID: "${this.JobParameters.sourceId}" with the UUID "${UUID}"`
      );
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
