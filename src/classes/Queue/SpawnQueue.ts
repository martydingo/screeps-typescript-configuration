export class SpawnQueue {
  public constructor() {
    this.initalizeSpawnQueueMemory();
  }
  private initalizeSpawnQueueMemory() {
    if (!Memory.queues.spawnQueue) {
      Memory.queues.spawnQueue = {};
    }
  }
}
