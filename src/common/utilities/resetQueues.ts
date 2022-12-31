export const resetQueues = {
  resetAllQueues(): void {
    Object.entries(Memory.queues.spawnQueue).forEach(([UUID]) => {
      delete Memory.queues.spawnQueue[UUID];
    });
    Object.entries(Memory.queues.jobQueue).forEach(([UUID]) => {
      delete Memory.queues.spawnQueue[UUID];
    });
  }
};
