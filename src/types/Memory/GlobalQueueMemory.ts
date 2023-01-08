export {};
declare global {
  interface GlobalQueueMemory {
    jobQueue: JobQueueMemory;
    spawnQueue: SpawnQueueMemory;
    attackQueue: AttackQueueMemory;
  }
}
