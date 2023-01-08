import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";
import { findPath } from "common/findPath";
import { Log } from "classes/Log";

@profile
export class DismantleEnemyBuildingsCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.moveHome(creep);
    if (creep.memory.status === "working") {
      let buildingToDismantle: Structure | undefined;
      if (creep.room.name === creep.memory.room) {
        if (creep.room.memory.monitoring.structures.spawns) {
          const cachedSpawnsInRoomDictionary = Object.entries(creep.room.memory.monitoring.structures.spawns);
          if (cachedSpawnsInRoomDictionary.length > 0) {
            if (cachedSpawnsInRoomDictionary.length === 1) {
              const spawnToDismantleId = cachedSpawnsInRoomDictionary[0][1].id;
              const spawnToDismantle = Game.getObjectById(spawnToDismantleId);
              if (spawnToDismantle) {
                buildingToDismantle = spawnToDismantle;
              }
            }
          } else {
            const manualRampartToKill = Game.getObjectById("63341e08b0485dbcf5342fd4" as Id<StructureRampart>);
            if (manualRampartToKill) {
              buildingToDismantle = manualRampartToKill;
            }
          }
        }
      }
      if (buildingToDismantle) {
        const dismantleResult = creep.dismantle(buildingToDismantle);
        if (dismantleResult === ERR_NOT_IN_RANGE) {
          this.moveCreep(creep, buildingToDismantle.pos);
        } else {
          if (dismantleResult !== OK) {
            Log.Alert(
              `${creep.name} in ${creep.room.name} encountered a ${dismantleResult} error while attempting to dismantle ${buildingToDismantle.structureType} - ${buildingToDismantle.id}`
            );
          }
        }
      }
    }
  }
}
