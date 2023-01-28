export {};

declare global {
  interface Memory {
    pathFinding: PathfinderMemory;
    monitoring?: GameMonitorMemory;
    queues: GlobalQueueMemory;
  }
}
