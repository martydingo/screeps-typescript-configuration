import { BaseCreep } from "classes/BaseCreep";

export class UpgradeControllerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.boostBodyParts(creep, WORK, RESOURCE_CATALYZED_GHODIUM_ACID);
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      this.fetchSource(creep);
    } else {
      if (creep.memory.status === "working") {
        const controllerId = creep.memory.controllerId;
        if (controllerId) {
          const controller: StructureController | null = Game.getObjectById(controllerId);
          if (controller) {
            const upgradeResult = this.upgradeController(creep, controller);
          }
        }
      }
    }
  }
  private upgradeController(creep: Creep, controller: StructureController): ScreepsReturnCode {
    const upgradeResult: ScreepsReturnCode = creep.upgradeController(controller);
    if (upgradeResult === ERR_NOT_IN_RANGE) {
      const moveResult = this.moveCreep(creep, controller.pos);
      return moveResult;
    } else {
      return upgradeResult;
    }
  }
}
