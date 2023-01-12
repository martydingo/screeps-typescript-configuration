import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class SourceMinerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    // this.checkBodyParts(creep);
    if (creep.memory.status !== "recyclingCreep") {
      this.moveHome(creep);
      if (creep.memory.status === "working" || creep.memory.status === "fetchingResource") {
        let dropEnergy = true;
        const creepSurroundings = this.lookAroundCreep(creep);
        creepSurroundings.forEach(([lookAtResults]) => {
          if (lookAtResults.type === "structure") {
            if (lookAtResults.structure?.structureType === "storage") {
              dropEnergy = false;
            }
          }
        });
        if (creep.memory.sourceId) {
          const source = Game.getObjectById(creep.memory.sourceId);
          if (source) {
            this.harvestSource(creep, source);
            if (dropEnergy === true) {
              creep.drop(RESOURCE_ENERGY);
            } else {
              if (creep.room.memory.monitoring.structures.storage) {
                const storage = Game.getObjectById(creep.room.memory.monitoring.structures.storage.id);
                if (storage) {
                  creep.transfer(storage, RESOURCE_ENERGY);
                }
              }
            }
          }
        }
      }
    } else {
      creep.memory.status = "working";
    }
  }
}
