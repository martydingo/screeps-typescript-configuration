export {};
declare global {
  interface TowerMonitorMemory {
    [towerId: Id<StructureTower>]: {
      energy: {
        energyAvailable: number;
        energyCapacity: number;
      };
      structure: {
        hits: number;
        hitsMax: number;
      };
    };
  }
}
