import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class harvestDepositCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    if (creep.memory.status === "working" || creep.memory.status === "fetchingResource") {
      if (creep.memory.status === "fetchingResource") {
        if (creep.pos.roomName !== creep.memory.room) {
          this.moveHome(creep);
          creep.memory.status = "fetchingResource";
        } else {
          console.log(creep);
          if (creep.memory.depositId) {
            const deposit = Game.getObjectById(creep.memory.depositId);
            if (deposit) {
              const harvestResult = this.harvestDeposit(creep, deposit);
              this.checkIfFull(creep, deposit.depositType);
            }
          }
        }
      } else if (creep.memory.status === "working") {
        this.checkIfFull(creep);
        if (creep.memory.storage) {
          const storage = Game.getObjectById(creep.memory.storage);
          if (storage) {
            if (storage.room) {
              const currentResources: ResourceConstant[] = [];
              Object.entries(creep.store).forEach(([resourceType]) => {
                currentResources.push(resourceType as ResourceConstant);
              });
              if (storage.room.terminal) {
                this.depositResource(creep, storage.room.terminal, currentResources[0]);
              } else {
                this.depositResource(creep, storage, currentResources[0]);
              }
            }
          }
        }
      }
    } else {
      if (creep.pos.roomName === creep.memory.room) {
        creep.memory.status = "fetchingResource";
      } else {
        this.moveHome(creep);
      }
    }
  }
}
