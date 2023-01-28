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
        if (creep.room.memory) {
          if (Object.entries(creep.room.memory.monitoring.structures.spawns).length > 0) {
            const cachedSpawnsInRoomDictionary = Object.entries(creep.room.memory.monitoring.structures.spawns);
            if (cachedSpawnsInRoomDictionary.length > 0) {
              if (cachedSpawnsInRoomDictionary.length === 1) {
                const spawnToDismantleId = cachedSpawnsInRoomDictionary[0][1].id;
                const spawnToDismantle = Game.getObjectById(spawnToDismantleId);
                if (spawnToDismantle) {
                  buildingToDismantle = spawnToDismantle;
                }
              }
            }
          } else {
            if (creep.room.memory.monitoring.structures.storage) {
              buildingToDismantle = creep.room.storage;
            } else {
              const hostileExtensionsDictionary = Object.entries(creep.room.memory.monitoring.structures.extensions);
              if (hostileExtensionsDictionary.length > 0) {
                const hostileExtensionArray: StructureExtension[] = [];
                hostileExtensionsDictionary.forEach(([hostileExtensionId]) => {
                  const hostileExtension = Game.getObjectById(hostileExtensionId as Id<StructureExtension>);
                  if (hostileExtension) {
                    hostileExtensionArray.push(hostileExtension);
                  }
                });
                if (hostileExtensionArray.length > 0) {
                  buildingToDismantle = hostileExtensionArray[0];
                }
              } else {
                const hostileLinksDictionary = Object.entries(creep.room.memory.monitoring.structures.links);
                if (hostileLinksDictionary.length > 0) {
                  const hostileLinkArray: StructureLink[] = [];
                  hostileLinksDictionary.forEach(([hostileLinkId]) => {
                    const hostileLink = Game.getObjectById(hostileLinkId as Id<StructureLink>);
                    if (hostileLink) {
                      hostileLinkArray.push(hostileLink);
                    }
                  });
                  if (hostileLinkArray.length > 0) {
                    buildingToDismantle = hostileLinkArray[0];
                  }
                } else {
                  const hostileTowersDictionary = Object.entries(creep.room.memory.monitoring.structures.towers);
                  if (hostileTowersDictionary.length > 0) {
                    const hostileTowerArray: StructureTower[] = [];
                    hostileTowersDictionary.forEach(([hostileTowerId]) => {
                      const hostileTower = Game.getObjectById(hostileTowerId as Id<StructureTower>);
                      if (hostileTower) {
                        hostileTowerArray.push(hostileTower);
                      }
                    });
                    if (hostileTowerArray.length > 0) {
                      buildingToDismantle = hostileTowerArray[0];
                    }
                  }
                }
              }
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
