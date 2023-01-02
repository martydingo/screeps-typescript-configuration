import { profile } from "Profiler";
import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

@profile
export class ClaimRoomJob {
  public JobParameters: ClaimRoomJobParameters;
  public constructor(JobParameters: ClaimRoomJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    Object.entries(Memory.queues.jobQueue)
      .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
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
      Log.Informational(`Creating "ClaimRoomJob" for Room ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: this.JobParameters.status,
          room: this.JobParameters.room,
          spawnRoom: this.JobParameters.spawnRoom,
          jobType: "claimRoom"
        },
        index,
        room: this.JobParameters.room,
        jobType: "claimRoom",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (Memory.queues.jobQueue[UUID]) {
      Log.Informational(`Deleting "ClaimRoomJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
