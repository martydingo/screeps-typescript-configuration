import { UpgradeControllerJob } from "classes/Job/UpgradeControllerJob";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { findPath } from "common/findPath";

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
                const count: number = creepNumbers[JobParameters.jobType];
                new UpgradeControllerJob(JobParameters, count);
              }
            }
          }
        }
      }
    }
  }
}
