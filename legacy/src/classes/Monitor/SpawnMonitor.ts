export class SpawnMonitor {
  // SpawnMonitor Interface
  public spawn: StructureSpawn;
  public constructor(spawnName: string) {
    this.spawn = Game.spawns[spawnName];
    this.initializeSpawnMonitorMemory();
    this.monitorSpawn();
    this.cleanHistory();
    this.copySpawnMonitoring();
  }
  private initializeSpawnMonitorMemory(): void {
    if (!this.spawn.memory.monitoring) {
      this.spawn.memory.monitoring = {};
    }
  }
  private cleanHistory(): void {
    const deleteThreshold = 100;
    const curTime = Game.time;
    Object.entries(this.spawn.memory.monitoring).forEach(([monitorTimeString]) => {
      const monitorTimeUnknown = monitorTimeString as unknown;
      const monitorTime = monitorTimeUnknown as number;
      if (monitorTime < curTime - deleteThreshold) {
        delete this.spawn.memory.monitoring[monitorTime];
      }
    });
  }
  public monitorSpawn(): void {
    let spawning = false;
    if (this.spawn.spawning != null) {
      spawning = true;
    }
    this.spawn.memory.monitoring[Game.time] = {
      energy: {
        energy: this.spawn.store[RESOURCE_ENERGY],
        energyCapacity: this.spawn.store.getCapacity(RESOURCE_ENERGY)
      },
      structure: {
        hits: this.spawn.hits,
        hitsMax: this.spawn.hitsMax
      },
      spawning
    };
  }
  public copySpawnMonitoring(): void {
    Memory.monitoring[this.spawn.pos.roomName].spawns[this.spawn.name] = this.spawn.memory.monitoring;
  }
}
