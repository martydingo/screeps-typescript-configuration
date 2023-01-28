import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

export class TransportResourceJob {
  public JobParameters: TransportResourceJobParameters;
  public constructor(JobParameters: TransportResourceJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    if (count === 0) {
      Object.entries(Memory.queues.jobQueue)
        .filter(
          ([, jobMemory]) =>
            jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
            jobMemory.jobParameters.room === this.JobParameters.room
        )
        .forEach(([jobUUID]) => {
          this.deleteJob(jobUUID);
        });
    }
    if (count === 1) {
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
      const UUID = base64.encode(
        `${this.JobParameters.jobType}-${this.JobParameters.room}-${this.JobParameters.resourceType}-${this.JobParameters.storage}-1`
      );
      this.createJob(UUID, 1);
    } else {
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

      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(
          `${this.JobParameters.jobType}-${this.JobParameters.room}-${this.JobParameters.resourceType}-${this.JobParameters.storage}-${iterations}`
        );
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Creating "TransportResourceJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`
      );
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "fetchingResource",
          room: this.JobParameters.room,
          spawnRoom: this.JobParameters.spawnRoom,
          jobType: "transportResource",
          resourceType: this.JobParameters.resourceType,
          resourceOrigin: this.JobParameters.resourceOrigin || undefined,
          storage: this.JobParameters.storage
        },
        index,
        room: this.JobParameters.room,
        jobType: "transportResource",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Deleting "LootResourceJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`
      );
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
