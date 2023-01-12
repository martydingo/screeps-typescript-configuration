import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

export class FeedTowerJob {
  public JobParameters: FeedTowerJobParameters;
  public constructor(JobParameters: FeedTowerJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    if (count === 0) {
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.towerId}-1`);
      this.deleteJob(UUID);
    } else if (count === 1) {
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.towerId}-1`);
      this.createJob(UUID, count);
    } else {
      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.towerId}-${iterations}`);
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Creating "FeedTowerJob" for Tower ID "${this.JobParameters.towerId} with the UUID of ${UUID}"`
      );
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "fetchingResource",
          room: this.JobParameters.room,
          jobType: "feedTower",
          towerId: this.JobParameters.towerId
        },
        index,
        room: this.JobParameters.room,
        jobType: "feedTower",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (Memory.queues.jobQueue[UUID]) {
      const jobParameters: FeedTowerJobParameters = Memory.queues.jobQueue[UUID]
        .jobParameters as FeedTowerJobParameters;
      Log.Informational(`Deleting "FeedTowerJob" for Tower ID "${jobParameters.towerId} with the UUID of ${UUID}"`);
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
