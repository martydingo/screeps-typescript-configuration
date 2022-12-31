export class SpawnMonitor {
  // SpawnMonitor Interface
  public constructor(spawn: StructureSpawn) {
    this.initializeSpawnMonitorMemory(spawn);
    this.monitorSpawn(spawn);
  }
  private initializeSpawnMonitorMemory(spawn: StructureSpawn): void {
    if (!spawn.room.memory.monitoring.structures.spawns) {
      spawn.room.memory.monitoring.structures.spawns = {};
    }
  }
  public monitorSpawn(spawn: StructureSpawn): void {
    let spawning = false;
    if (spawn.spawning != null) {
      spawning = true;
    }
    if (spawn.room.memory.monitoring.structures.spawns) {
      spawn.room.memory.monitoring.structures.spawns[spawn.name] = {
        energy: {
          energyAvailable: spawn.store[RESOURCE_ENERGY],
          energyCapacity: spawn.store.getCapacity(RESOURCE_ENERGY)
        },
        structure: {
          hits: spawn.hits,
          hitsMax: spawn.hitsMax
        },
        spawning
      };
    }
  }
}
