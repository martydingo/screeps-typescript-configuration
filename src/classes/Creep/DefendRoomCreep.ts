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
    this.moveHome(creep);
    if (creep.memory.status === "working") {
      const hostileCreep = fetchHostileCreep(creep.room);
      if (hostileCreep) {
        this.attackCreep(creep, hostileCreep);
      } else {
        const closestSpawn = findPath.findClosestSpawnToRoom(creep.pos.roomName);
        const recycleResult = closestSpawn.recycleCreep(creep);
        if (recycleResult === ERR_NOT_IN_RANGE) {
          this.moveCreep(creep, closestSpawn.pos);
        } else {
          if (recycleResult === OK) {
            Log.Debug(`${creep.name} of creepType ${creep.memory.jobType} in ${creep.pos.roomName} has been recycled`);
          } else {
            Log.Warning(
              `${creep.name} of creepType ${creep.memory.jobType} in ${creep.pos.roomName} has encountered a ${recycleResult} error while attempting to be recycled`
            );
          }
        }
      }
    }
  }
}
