import { profile } from "Profiler";
import { BaseCreep } from "classes/BaseCreep";

@profile
export class SourceMinerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    if (creep.memory.sourceId) {
      this.checkIfFull(creep, RESOURCE_ENERGY);
      if (creep.memory.status === "fetchingResource") {
        const source = Game.getObjectById(creep.memory.sourceId);
        if (source) {
          this.harvestSource(creep, source);
        }
      } else if (creep.memory.status === "working") {
        let dropEnergy = false;
        if (creep.room.memory.monitoring.structures.storage) {
          const storage = Game.getObjectById(creep.room.memory.monitoring.structures.storage.id);
          if (storage) {
            dropEnergy = false;
          } else dropEnergy = true;
        } else dropEnergy = true;
        if (dropEnergy === true) {
          creep.drop(RESOURCE_ENERGY);
        } else if (creep.room.memory.monitoring.structures.storage) {
          const storage = Game.getObjectById(creep.room.memory.monitoring.structures.storage.id);
          if (storage) {
            this.depositResource(creep, storage, RESOURCE_ENERGY);
          }
        }
      }
    }
  }
}
