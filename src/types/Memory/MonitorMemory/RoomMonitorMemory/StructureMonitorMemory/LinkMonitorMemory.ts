export {};
declare global {
  interface LinkMonitorMemory {
    [id: Id<StructureLink>]: {
      energy: {
        energyAvailable: number;
        energyCapacity: number;
      };
      mode?: string;
    };
  }
}
