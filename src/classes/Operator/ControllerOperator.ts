import { profile } from "Profiler";
import { UpgradeControllerJob } from "classes/Job/UpgradeControllerJob";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { findPath } from "common/findPath";
import { creepNumbersOverride } from "configuration/rooms/creepNumbersOverride";

@profile
export class ControllerOperator {
  public constructor() {
    this.operateController();
  }
  private operateController() {
    if (Memory.rooms) {
      for (const roomName in Memory.rooms) {
        if (Memory.rooms[roomName].monitoring.structures.controller) {
          const controllerId: Id<StructureController> | undefined =
            Memory.rooms[roomName].monitoring.structures.controller?.id;
          if (controllerId) {
            const controller: StructureController | null = Game.getObjectById(controllerId);
            if (controller) {
              if (controller.my) {
                let roomEnergyLow = false;
                let roomDowngradeRisk = false;
                const room = controller.room;
                if (room) {
                  const storage = room.storage;
                  if (storage) {
                    if (storage.store[RESOURCE_ENERGY] < 100000) {
                      roomEnergyLow = true;
                    }
                  }
                }
                if (controller.ticksToDowngrade < 5000) {
                  roomDowngradeRisk = true;
                }
                let spawnRoom = controller.pos.roomName;
                if (Object.entries(controller.room.memory.monitoring.structures.spawns).length === 0) {
                  spawnRoom = findPath.findClosestSpawnToRoom(controller.pos.roomName).pos.roomName;
                }
                const JobParameters: UpgradeControllerJobParameters = {
                  status: "fetchingResource",
                  room: controller.pos.roomName,
                  spawnRoom,
                  jobType: "upgradeController",
                  controllerId: controller.id
                };

                let count: number = creepNumbers[JobParameters.jobType];
                if (creepNumbersOverride[roomName]) {
                  if (creepNumbersOverride[roomName][JobParameters.jobType]) {
                    count = count + creepNumbersOverride[roomName][JobParameters.jobType];
                  }
                }
                if (!roomDowngradeRisk) {
                  if (roomEnergyLow) {
                    count = 0;
                  }
                }
                new UpgradeControllerJob(JobParameters, count);
              }
            }
          }
        }
      }
    }
  }
}
