/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { findPath } from "common/findPath";
import { movePathColors } from "configuration/visual/movePathColors";
import { profile } from "Profiler";
import { Log } from "./Log";

@profile
export class BaseCreep {
  public constructor(creep: Creep) {
    //
  }
  public checkIfFull(creep: Creep, resource: ResourceConstant): void {
    if (creep.memory.status === "fetchingResource") {
      if (creep.store.getFreeCapacity(resource) === 0) {
        if (creep.store.getCapacity(resource) === creep.store[resource]) {
          creep.memory.status = "working";
        } else {
          if (creep.store.getFreeCapacity(resource) === 0) {
            Object.entries(creep.store).forEach(([resourceType]) => {
              if (resourceType !== resource) {
                if (resourceType === RESOURCE_ENERGY) {
                  if (creep.room.storage) {
                    this.depositResource(creep, creep.room.storage, resourceType);
                  }
                } else {
                  if (creep.room.terminal) {
                    this.depositResource(creep, creep.room.terminal, resourceType as ResourceConstant);
                  } else {
                    creep.drop(resourceType as ResourceConstant);
                  }
                }
              }
            });
          }
        }
      }
    } else if (creep.memory.status === "working") {
      if (creep.store[resource] === 0 && creep.store.getFreeCapacity(resource) > 0) {
        creep.memory.status = "fetchingResource";
      }
    }
  }
  public boostBodyParts(creep: Creep, bodyPart: BodyPartConstant, mineral: MineralBoostConstant) {
    const creepSpecificBodyPartCount = creep.body.filter(creepBodyPart => creepBodyPart.type === bodyPart).length;
    const creepSpecificBoostedBodyPartCount = creep.body.filter(
      creepBodyPart => creepBodyPart.type === bodyPart && creepBodyPart.boost === mineral
    ).length;

    if (creepSpecificBodyPartCount !== creepSpecificBoostedBodyPartCount) {
      const mineralString = mineral.toString().toUpperCase();
      const labsWithMineral = Object.entries(creep.room.memory.monitoring.structures.labs).filter(
        ([, labMonitorMemory]) => labMonitorMemory.resources[mineralString]
      );
      if (!creep.spawning) {
        if (labsWithMineral.length > 0) {
          const labId = labsWithMineral[0][0] as Id<StructureLab>;
          const lab = Game.getObjectById(labId);
          if (lab) {
            if (lab.store[RESOURCE_ENERGY] > LAB_ENERGY_CAPACITY / 10) {
              creep.memory.status = "fetchingBoosts";
              const boostResult = lab.boostCreep(creep);
              if (boostResult === ERR_NOT_IN_RANGE) {
                this.moveCreep(creep, lab.pos);
              } else {
                if (boostResult !== OK) {
                  Log.Warning(
                    `${creep.name} in ${creep.room.name} has encountered a ${boostResult} error code while trying to boost bodyparts with the mineral ${mineral}`
                  );
                } else {
                  creep.memory.status = "working";
                }
              }
            }
          }
        }
      }
    } else {
      if (creep.memory.status === "fetchingBoosts") {
        creep.memory.status = "working";
      }
    }
  }
  public moveHome(creep: Creep): void {
    if (creep.memory.status === "working" || creep.memory.status === "fetchingResource") {
      if (creep.pos.roomName !== creep.memory.room) {
        creep.memory.status = "movingIntoRoom";
      }
    }
    if (creep.memory.status === "movingIntoRoom") {
      if (creep.pos.roomName === creep.memory.room) {
        delete creep.memory.safeRoute;
        creep.memory.status = "working";
      } else {
        // this.moveCreep(creep, new RoomPosition(25, 25, creep.memory.room));
        if (!creep.memory.safeRoute) {
          creep.memory.safeRoute = this.fetchSafePath(creep, creep.memory.room);
        }
        if (creep.memory.safeRoute[1]) {
          if (creep.pos.roomName === creep.memory.safeRoute[0].roomName) {
            delete creep.memory.safeRoute[0];
            creep.memory.safeRoute[0] = creep.memory.safeRoute[1];
            delete creep.memory.safeRoute[1];
          }
        }
        this.moveCreep(creep, creep.memory.safeRoute[0]);
      }
    }
  }
  public fetchSafePath(creep: Creep, destinationRoomName: string) {
    const safeRoute: RoomPosition[] = [];
    const safeExits = findPath.findSafePathToRoom(creep.pos.roomName, destinationRoomName);
    if (safeExits !== -2) {
      Object.entries(safeExits).forEach(([roomExitArrayIndexString, roomExitArrayDictionary]) => {
        const roomExitArrayIndexUnknown = roomExitArrayIndexString as unknown;
        const roomExitArrayIndex = roomExitArrayIndexUnknown as number;
        const roomPositionCoordinates = findPath.findClearTerrain(roomExitArrayDictionary.room);
        safeRoute[roomExitArrayIndex] = roomPositionCoordinates;
      });
    }
    return safeRoute;
  }
  public moveCreep(creep: Creep, destination: RoomPosition): ScreepsReturnCode {
    let nextDestination = destination;
    if (creep.pos.roomName !== destination.roomName) {
      if (!creep.memory.safeRoute) {
        creep.memory.safeRoute = this.fetchSafePath(creep, destination.roomName);
      }
    } else {
      delete creep.memory.safeRoute;
    }
    if (creep.memory.safeRoute) {
      nextDestination = new RoomPosition(
        creep.memory.safeRoute[0].x,
        creep.memory.safeRoute[0].y,
        creep.memory.safeRoute[0].roomName
      );
    }
    const moveResult = creep.moveTo(nextDestination, {
      visualizePathStyle: {
        fill: "transparent",
        stroke: movePathColors[creep.memory.jobType],
        lineStyle: "dotted",
        strokeWidth: 0.1,
        opacity: 0.66
      }
    });
    return moveResult;
  }
  public harvestSource(creep: Creep, source: Source): ScreepsReturnCode {
    const harvestResult = creep.harvest(source);
    if (harvestResult === ERR_NOT_IN_RANGE) {
      const moveResult = this.moveCreep(creep, source.pos);
      return moveResult;
    } else {
      return harvestResult;
    }
  }
  public pickupResource(creep: Creep, origin: Resource<ResourceConstant>): ScreepsReturnCode {
    const pickupResult = creep.pickup(origin);
    if (pickupResult === ERR_NOT_IN_RANGE) {
      const moveResult = this.moveCreep(creep, origin.pos);
      return moveResult;
    } else return pickupResult;
  }
  public withdrawResource(creep: Creep, origin: Structure, resource: ResourceConstant): ScreepsReturnCode {
    const withdrawResult = creep.withdraw(origin, resource);
    if (withdrawResult === ERR_NOT_IN_RANGE) {
      const moveResult = this.moveCreep(creep, origin.pos);
      return moveResult;
    } else return withdrawResult;
  }
  public fetchSource(creep: Creep, forceStorage = false): void {
    const linkDistances: { [key: Id<StructureLink>]: number } = {};
    let sortedLinkDistances: [string, number][] = [];
    let storageUsable = false;
    let linksUsable = false;
    let useStorage = false;
    let useLinks = false;
    if (forceStorage) {
      useStorage = true;
    } else {
      if (creep.room.memory.monitoring.structures.links) {
        if (
          Object.entries(creep.room.memory.monitoring.structures.links).filter(
            ([, cachedLink]) => cachedLink.mode === "rx" && cachedLink.energy.energyAvailable > 0
          ).length > 0
        ) {
          linksUsable = true;
        }
      }
      if (creep.room.memory.monitoring.structures.storage) {
        if (creep.room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY]) {
          if (
            creep.room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY].resourceAmount >=
            creep.store.getFreeCapacity(RESOURCE_ENERGY)
          ) {
            storageUsable = true;
          }
        }
      }
    }
    if (storageUsable || linksUsable) {
      if (!linksUsable) {
        useStorage = true;
      } else {
        if (!storageUsable) {
          useLinks = true;
        } else {
          Object.entries(creep.room.memory.monitoring.structures.links)
            .filter(([, cachedLink]) => cachedLink.mode === "rx" && cachedLink.energy.energyAvailable > 0)
            .forEach(([cachedLinkIdString]) => {
              const cachedLinkId = cachedLinkIdString as Id<StructureLink>;
              const cachedLink = Game.getObjectById(cachedLinkId);
              if (cachedLink) {
                linkDistances[cachedLinkId] = creep.pos.getRangeTo(cachedLink);
              }
            });
          if (Object.entries(linkDistances).length > 0) {
            sortedLinkDistances = Object.entries(linkDistances).sort(
              ([, linkDistanceA], [, linkDistanceB]) => linkDistanceA - linkDistanceB
            );
            if (sortedLinkDistances[0]) {
              if (creep.room.storage) {
                const storageDistance = creep.pos.getRangeTo(creep.room.storage.pos);
                if (storageDistance <= sortedLinkDistances[0][1]) {
                  useStorage = true;
                } else {
                  useLinks = true;
                }
              }
            }
          }
        }
      }
    }
    if (useLinks === true) {
      if (Object.entries(sortedLinkDistances)[0]) {
        const linkId = sortedLinkDistances[0][0] as Id<StructureLink>;
        const link = Game.getObjectById(linkId);
        if (link) {
          this.withdrawResource(creep, link, RESOURCE_ENERGY);
        }
      }
    } else {
      if (useStorage === true) {
        if (creep.room.memory.monitoring.structures.storage) {
          const storageId = creep.room.memory.monitoring.structures.storage.id;
          const storage = Game.getObjectById(storageId);
          if (storage) {
            this.withdrawResource(creep, storage, RESOURCE_ENERGY);
          }
        }
      } else {
        const droppedResourceArray: Resource<ResourceConstant>[] = [];
        Object.entries(creep.room.memory.monitoring.droppedResources)
          .filter(DroppedResource => DroppedResource[1].resourceType === RESOURCE_ENERGY)
          .forEach(([droppedResourceId]) => {
            const droppedResource = Game.getObjectById(droppedResourceId as Id<Resource<ResourceConstant>>);
            if (droppedResource) {
              droppedResourceArray.push(droppedResource);
            }
          });
        if (droppedResourceArray.length > 0) {
          const closestDroppedEnergy = creep.pos.findClosestByPath(droppedResourceArray);
          if (closestDroppedEnergy) {
            this.pickupResource(creep, closestDroppedEnergy);
          }
        } else {
          if (Object.entries(creep.body).filter(([, bodyPart]) => bodyPart.type === WORK)) {
            const sourceArray: Source[] = [];
            Object.entries(creep.room.memory.monitoring.sources).forEach(([sourceId]) => {
              const source = Game.getObjectById(sourceId as Id<Source>);
              if (source) {
                if (source.energy <= source.energyCapacity) {
                  sourceArray.push(source);
                }
              }
            });
            if (sourceArray.length > 0) {
              const closestSource = creep.pos.findClosestByPath(sourceArray);
              if (closestSource) {
                this.harvestSource(creep, closestSource);
              }
            }
          }
        }
      }
    }
  }

  public depositResource(
    creep: Creep,
    destination: Structure<StructureConstant> | AnyCreep,
    resource: ResourceConstant
  ): ScreepsReturnCode {
    const depositResult = creep.transfer(destination, resource);
    if (depositResult === ERR_NOT_IN_RANGE) {
      const moveResult = this.moveCreep(creep, destination.pos);
      return moveResult;
    } else return depositResult;
  }

  public healCreep(creep: Creep, targetCreep?: Creep) {
    if (!targetCreep) {
      targetCreep = creep;
    }
    const healResult = creep.heal(targetCreep);
    if (healResult === ERR_NOT_IN_RANGE) {
      this.moveCreep(creep, targetCreep.pos);
    } else {
      if (healResult !== OK) {
        Log.Alert(
          `${creep.name} in room ${creep.pos.roomName} tried to heal ${targetCreep.name} in room ${targetCreep.pos.roomName}, but failed with a result of ${healResult}`
        );
      }
    }
  }
  public attackCreep(creep: Creep, targetCreep: Creep) {
    const attackResult = creep.attack(targetCreep);
    if (attackResult === ERR_NOT_IN_RANGE) {
      this.moveCreep(creep, targetCreep.pos);
    } else {
      if (attackResult !== OK) {
        Log.Alert(
          `${creep.name} in room ${creep.pos.roomName} tried to attack ${targetCreep.name} in room ${targetCreep.pos.roomName}, but failed with a result of ${attackResult}`
        );
      }
    }
  }
}
