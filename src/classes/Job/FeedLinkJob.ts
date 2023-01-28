import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

export class FeedLinkJob {
  public JobParameters: FeedLinkJobParameters;
  public constructor(JobParameters: FeedLinkJobParameters, count = 1) {
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
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.linkId}-1`);
      this.createJob(UUID, 1);
    } else {
      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.linkId}-${iterations}`);
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(`Creating "FeedLinkJob" for Link ID "${this.JobParameters.linkId} with the UUID of ${UUID}"`);
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "fetchingResource",
          room: this.JobParameters.room,
          jobType: "feedLink",
          linkId: this.JobParameters.linkId
        },
        index,
        room: this.JobParameters.room,
        jobType: "feedLink",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (Memory.queues.jobQueue[UUID]) {
      Log.Informational(`Deleting "FeedLinkJob" for Link ID "${this.JobParameters.linkId} with the UUID of ${UUID}"`);
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
