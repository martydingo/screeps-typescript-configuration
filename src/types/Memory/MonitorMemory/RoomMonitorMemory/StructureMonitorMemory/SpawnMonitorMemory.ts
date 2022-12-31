export {};

declare global {
  export interface SpawnMonitorMemory {
    [spawnName: string]: {
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
