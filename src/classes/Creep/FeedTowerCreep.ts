import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class FeedTowerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      this.fetchSource(creep);
    } else if (creep.memory.status === "working") {
      if (creep.memory.towerId) {
        const tower = Game.getObjectById(creep.memory.towerId);
        if (tower) {
          this.depositResource(creep, tower, RESOURCE_ENERGY);
        }
      }
    }
  }
}
