export {};
declare global {
  interface RoomQueueMemory {
    spawnQueue: SpawnQueueMemory;
    terminalQueue: TerminalQueueMemory;
    labQueue: LabQueueMemory;
    factoryQueue: FactoryQueueMemory;
  }
}
