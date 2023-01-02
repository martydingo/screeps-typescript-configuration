import { profile } from "Profiler";
import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

@profile
export class FactoryEngineerJob {
  public JobParameters: FactoryEngineerJobParameters;
  public constructor(JobParameters: FactoryEngineerJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    Object.entries(Memory.queues.jobQueue)
      .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
      .forEach(([jobUUID, jobMemory]) => {
        if (jobMemory.index > count) {
          this.deleteJob(jobUUID);
        }
      });
    if (count === 1) {
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.factoryId}-1`);
      this.createJob(UUID, 1);
    } else {
      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.factoryId}-${iterations}`);
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Creating "FactoryEngineerJob" for Factory ID: "${this.JobParameters.factoryId}" with the UUID "${UUID}"`
      );
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "awaitingJob",
          room: this.JobParameters.room,
          spawnRoom: this.JobParameters.spawnRoom,
          jobType: "factoryEngineer",
          factoryId: this.JobParameters.factoryId
        },
        index,
        room: this.JobParameters.room,
        jobType: "factoryEngineer",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Deleting "FactoryEngineerJob" for Factory ID: "${this.JobParameters.factoryId}" with the UUID "${UUID}"`
      );
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
