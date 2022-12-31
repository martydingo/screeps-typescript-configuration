export {};
declare global {
  interface ExtensionMonitorMemory {
    [id: Id<StructureExtension>]: {
      energyAvailable: number;
      energyCapacity: number;
    };
  }
}
