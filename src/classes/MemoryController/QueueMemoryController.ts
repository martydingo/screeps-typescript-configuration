export class QueueMemoryController {
  public constructor() {
    this.maintainQueueMemoryHealth();
  }
  private maintainQueueMemoryHealth(): void {
    if (!Memory.queues) {
      this.initializeQueueMemory();
    } else {
      if (!Memory.queues.spawnQueue || !Memory.queues.jobQueue) {
        if (!Memory.queues.spawnQueue) {
          this.initializeSpawnQueueMemory();
        } else {
          if (!Memory.queues.jobQueue) {
            this.initializeJobQueueMemory();
          }
        }
      }
    }
  }
  private initializeQueueMemory(): void {
    Memory.queues = {
      jobQueue: {},
      spawnQueue: {}
    };
  }
  private initializeSpawnQueueMemory(): void {
    Memory.queues.spawnQueue = {};
  }
  private initializeJobQueueMemory(): void {
    Memory.queues.jobQueue = {};
  }
}
