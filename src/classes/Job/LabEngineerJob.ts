import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

export class LabEngineerJob {
  public JobParameters: LabEngineerJobParameters;
  public constructor(JobParameters: LabEngineerJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    Object.entries(Memory.queues.jobQueue)
      .filter(
        ([, jobMemory]) =>
          jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
          jobMemory.jobParameters.room === this.JobParameters.room
      )
      .forEach(([jobUUID, jobMemory]) => {
        if (jobMemory.index > count) {
          this.deleteJob(jobUUID);
        }
      });
    if (count === 1) {
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
      this.createJob(UUID, 1);
    } else {
      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(`Creating "LabEngineerJob" for Room: "${this.JobParameters.room}" with the UUID "${UUID}"`);
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "awaitingJob",
          room: this.JobParameters.room,
          spawnRoom: this.JobParameters.spawnRoom,
          jobType: "labEngineer"
        },
        index,
        room: this.JobParameters.room,
        jobType: "labEngineer",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (Memory.queues.jobQueue[UUID]) {
      Log.Informational(`Deleting "LabEngineerJob" for Room: "${this.JobParameters.room}" with the UUID "${UUID}"`);
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
