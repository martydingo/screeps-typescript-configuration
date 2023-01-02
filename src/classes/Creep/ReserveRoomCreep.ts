import { profile } from "Profiler";
import { BaseCreep } from "classes/BaseCreep";
import { Log } from "classes/Log";

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
              const reserveResult = creep.reserveController(controllerToReserve);
              if (reserveResult === ERR_NOT_IN_RANGE) {
                this.moveCreep(creep, controllerToReserve.pos);
              } else if (reserveResult === ERR_NOT_OWNER) {
                if (controllerToReserve.owner?.username === "Invader") {
                  const attackControllerResult = creep.attackController(controllerToReserve);
                  if (attackControllerResult === ERR_NOT_IN_RANGE) {
                    this.moveCreep(creep, controllerToReserve.pos);
                  } else {
                    Log.Warning(
                      `Attack Controller Result for ${creep.name} in ${creep.pos.roomName}: ${attackControllerResult}`
                    );
                  }
                }
              } else Log.Warning(`Reserve Result for ${creep.name} in ${creep.pos.roomName}: ${reserveResult}`);
            }
          }
        }
      }
    }
  }
}
