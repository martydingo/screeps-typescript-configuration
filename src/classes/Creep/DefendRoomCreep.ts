import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";
import { findPath } from "common/findPath";
import { fetchHostileCreep } from "common/fetchHostileCreep";
import { Log } from "classes/Log";

@profile
export class DefendRoomCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    if (Object.entries(creep.body).filter(([, bodyPart]) => bodyPart.type === HEAL).length > 0) {
      if (creep.hits < creep.hitsMax) {
        this.healCreep(creep);
      }
    }
    if (creep.memory.status !== "recyclingCreep") {
      this.moveHome(creep);
      if (creep.memory.status === "working") {
        const hostileCreep = fetchHostileCreep(creep.room);
        if (hostileCreep) {
          this.attackCreep(creep, hostileCreep);
        } else {
          creep.memory.status = "recyclingCreep";
        }
      }
    }
  }
}
