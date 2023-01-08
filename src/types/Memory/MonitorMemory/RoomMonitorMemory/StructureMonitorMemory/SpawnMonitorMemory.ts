export {};

declare global {
  export interface SpawnMonitorMemory {
    [spawnName: string]: {
      id: Id<StructureSpawn>;
      energy: {
        energyAvailable: number;
        energyCapacity: number;
      };
      structure: {
        hits: number;
        hitsMax: number;
      };
      spawning: boolean;
    };
  }
}
