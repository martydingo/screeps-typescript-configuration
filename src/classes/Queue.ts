import { JobQueue } from "./Queue/JobQueue";
import { SpawnQueue } from "./Queue/SpawnQueue";

export class Queue {
  public constructor() {
    this.runQueues();
  }

  private runQueues(): void {
    this.runJobQueue();
    this.runSpawnQueue();
  }
  private runSpawnQueue(): void {
    new SpawnQueue();
  }
  private runJobQueue(): void {
    new JobQueue();
  }
}
