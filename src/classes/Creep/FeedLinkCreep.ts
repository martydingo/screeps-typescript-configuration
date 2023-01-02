import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class FeedLinkCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      // Second argument forces use of storage
      this.fetchSource(creep, true);
    } else if (creep.memory.status === "working") {
      if (creep.memory.linkId) {
        const link = Game.getObjectById(creep.memory.linkId);
        if (link) {
          this.depositResource(creep, link, RESOURCE_ENERGY);
        }
      }
    }
  }
}
