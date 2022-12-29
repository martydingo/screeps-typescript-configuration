import { BaseCreep } from "classes/BaseCreep";
import { findPath } from "common/findPath";

export class ScoutRoomCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.moveHome(creep);
    if (creep.memory.status === "working") {
      this.moveCreep(creep, findPath.findClearTerrain(creep.memory.room));
    }
  }
}
