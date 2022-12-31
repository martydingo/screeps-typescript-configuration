import { BaseCreep } from "classes/BaseCreep";
import { Log } from "classes/Log";

export class ClaimRoomCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.moveHome(creep);
    if (creep.memory.status === "working") {
      if (Memory.rooms[creep.memory.room].monitoring.structures.controller) {
        const controllerToClaimMemory = Memory.rooms[creep.memory.room].monitoring.structures.controller;
        if (controllerToClaimMemory) {
          const controllerToClaimId = controllerToClaimMemory.id;
          if (controllerToClaimId) {
            const controllerToClaim = Game.getObjectById(controllerToClaimId);
            if (controllerToClaim) {
              const claimResult = creep.claimController(controllerToClaim);
              if (claimResult === ERR_NOT_IN_RANGE) {
                this.moveCreep(creep, controllerToClaim.pos);
              } else if (claimResult === ERR_NOT_OWNER) {
                if (controllerToClaim.owner?.username === "Invader") {
                  const attackControllerResult = creep.attackController(controllerToClaim);
                  if (attackControllerResult === ERR_NOT_IN_RANGE) {
                    this.moveCreep(creep, controllerToClaim.pos);
                  } else {
                    Log.Warning(
                      `Attack Controller Result for ${creep.name} in ${creep.pos.roomName}: ${attackControllerResult}`
                    );
                  }
                }
              } else Log.Warning(`Claim Result for ${creep.name} in ${creep.pos.roomName}: ${claimResult}`);
            }
          }
        }
      }
    }
  }
}
