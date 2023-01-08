import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";
import { Log } from "classes/Log";
import { findPath } from "common/findPath";

@profile
export class ReserveRoomCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.moveHome(creep);
    if (creep.memory.status === "working") {
      if (Memory.rooms[creep.memory.room].monitoring.structures.controller) {
        const controllerToReserveMemory = Memory.rooms[creep.memory.room].monitoring.structures.controller;
        if (controllerToReserveMemory) {
          const controllerToReserveId = controllerToReserveMemory.id;
          if (controllerToReserveId) {
            const controllerToReserve = Game.getObjectById(controllerToReserveId);
            if (controllerToReserve) {
              let recycleCreep = false;
              if (creep.ticksToLive && controllerToReserve.upgradeBlocked) {
                if (creep.ticksToLive < controllerToReserve.upgradeBlocked) {
                  recycleCreep = true;
                }
              }
              if (recycleCreep) {
                const closestSpawn = findPath.findClosestSpawnToRoom(creep.pos.roomName);
                if (closestSpawn) {
                  const recycleResult = closestSpawn.recycleCreep(creep);
                  if (recycleResult === ERR_NOT_IN_RANGE) {
                    this.moveCreep(creep, closestSpawn.pos);
                  } else {
                    if (recycleResult === OK) {
                      Log.Debug(
                        `${creep.name} of creepType ${creep.memory.jobType} in ${creep.pos.roomName} has been recycled`
                      );
                    } else {
                      Log.Warning(
                        `${creep.name} of creepType ${creep.memory.jobType} in ${creep.pos.roomName} has encountered a ${recycleResult} error while attempting to be recycled`
                      );
                    }
                  }
                }
              } else {
                const reserveResult = creep.reserveController(controllerToReserve);
                if (reserveResult === ERR_NOT_IN_RANGE) {
                  this.moveCreep(creep, controllerToReserve.pos);
                } else if (reserveResult === ERR_INVALID_TARGET) {
                  const attackControllerResult = creep.attackController(controllerToReserve);
                  if (attackControllerResult === ERR_NOT_IN_RANGE) {
                    this.moveCreep(creep, controllerToReserve.pos);
                  } else {
                    Log.Warning(
                      `Attack Controller Result for ${creep.name} in ${creep.pos.roomName}: ${attackControllerResult}`
                    );
                  }
                } else if (reserveResult !== OK) {
                  Log.Warning(`Reserve Result for ${creep.name} in ${creep.pos.roomName}: ${reserveResult}`);
                }
              }
            }
          }
        }
      }
    }
  }
}
