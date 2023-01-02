import { profile } from "Profiler";
@profile
export class TowerMonitor {
  public constructor(tower: StructureTower) {
    this.initalizeTowerMonitorMemory(tower);
    this.monitorTower(tower);
  }
  private initalizeTowerMonitorMemory(tower: StructureTower) {
    if (!tower.room.memory.monitoring.structures.towers) {
      tower.room.memory.monitoring.structures.towers = {};
    }
  }
  private monitorTower(tower: StructureTower) {
    if (tower) {
      if (tower.room.memory.monitoring.structures.towers) {
        tower.room.memory.monitoring.structures.towers[tower.id] = {
          energy: {
            energyAvailable: tower.store[RESOURCE_ENERGY],
            energyCapacity: tower.store.getCapacity(RESOURCE_ENERGY)
          },
          structure: {
            hits: tower.hits,
            hitsMax: tower.hitsMax
          }
        };
      }
    }
  }
}
