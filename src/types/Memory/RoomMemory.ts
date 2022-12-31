export {};

declare global {
  interface RoomMemory {
    monitoring: RoomMonitorMemory;
    queues: RoomQueueMemory;
    [key: string]: any;
  }
}
