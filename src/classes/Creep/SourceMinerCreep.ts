import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class SourceMinerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.moveHome(creep);
    if (creep.memory.status === "working" || creep.memory.status === "fetchingResource") {
      if (creep.memory.sourceId) {
        const source = Game.getObjectById(creep.memory.sourceId);
        if (source) {
          const harvestResult = this.harvestSource(creep, source);
          if (harvestResult === OK) {
            if (creep.room.storage) {
              const transferResult = creep.transfer(creep.room.storage, RESOURCE_ENERGY);
              if (transferResult !== OK) {
                creep.drop(RESOURCE_ENERGY);
              }
            }
          }
        }
      }
    }
  }
}
