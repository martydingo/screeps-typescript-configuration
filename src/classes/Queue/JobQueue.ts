export class JobQueue {
  public constructor() {
    this.initalizeJobQueueMemory();
  }
  private initalizeJobQueueMemory(): void {
    if (!Memory.queues.jobQueue) {
      Memory.queues.jobQueue = {};
    }
  }
}
