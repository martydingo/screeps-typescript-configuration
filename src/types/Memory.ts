export {};

declare global {
  interface Memory {
    monitoring?: GameMonitorMemory;
    queues: GlobalQueueMemory;
  }
}
