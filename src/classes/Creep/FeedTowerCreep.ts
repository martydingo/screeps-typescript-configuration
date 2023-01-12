import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class FeedTowerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    if (creep.memory.towerId) {
      const tower = Game.getObjectById(creep.memory.towerId);
      if (tower) {
        if (creep.memory.status === "recyclingCreep") {
          creep.memory.status = "working";
        }
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
          this.fetchSource(creep);
        } else {
          if (creep.memory.status === "working") {
            this.depositResource(creep, tower, RESOURCE_ENERGY);
          }
        }
      }
    }
  }
}
