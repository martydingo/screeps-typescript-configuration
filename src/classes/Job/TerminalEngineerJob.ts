import { profile } from "Profiler";
import { Log } from "classes/Log";
import { base64 } from "common/utilities/base64";

@profile
export class TerminalEngineerJob {
  public JobParameters: TerminalEngineerJobParameters;
  public constructor(JobParameters: TerminalEngineerJobParameters, count = 1) {
    this.JobParameters = JobParameters;
    Object.entries(Memory.queues.jobQueue)
      .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
      .forEach(([jobUUID, jobMemory]) => {
        if (jobMemory.index > count) {
          this.deleteJob(jobUUID);
        }
      });
    if (count === 1) {
      const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.terminalId}-1`);
      this.createJob(UUID, 1);
    } else {
      let iterations = 1;
      while (iterations <= count) {
        const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.terminalId}-${iterations}`);
        this.createJob(UUID, iterations);
        iterations++;
      }
    }
  }
  private createJob(UUID: string, index: number) {
    if (!Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Creating "TerminalEngineerJob" for Terminal ID: "${this.JobParameters.terminalId}" with the UUID "${UUID}"`
      );
      Memory.queues.jobQueue[UUID] = {
        jobParameters: {
          uuid: UUID,
          status: "awaitingJob",
          room: this.JobParameters.room,
          spawnRoom: this.JobParameters.spawnRoom,
          jobType: "terminalEngineer",
          terminalId: this.JobParameters.terminalId
        },
        index,
        room: this.JobParameters.room,
        jobType: "terminalEngineer",
        timeAdded: Game.time
      };
    }
  }
  private deleteJob(UUID: string) {
    if (Memory.queues.jobQueue[UUID]) {
      Log.Informational(
        `Deleting "TerminalEngineerJob" for Terminal ID: "${this.JobParameters.terminalId}" with the UUID "${UUID}"`
      );
      delete Memory.queues.jobQueue[UUID];
    }
  }
}
