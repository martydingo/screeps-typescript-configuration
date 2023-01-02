import { profile } from "Profiler";
@profile
export class ControllerMonitor {
  public constructor(controller: StructureController) {
    this.monitorController(controller);
  }

  private monitorController(controller: StructureController): void {
    if (controller) {
      const room: Room = controller.room;
      let controllerMonitorDictionary: ControllerMonitorMemory;
      if (controller.safeMode) {
        controllerMonitorDictionary = {
          id: controller.id,
          progress: controller.progress,
          nextLevel: controller.progressTotal,
          downgrade: controller.ticksToDowngrade,
          safeMode: true,
          safeModeCooldown: controller.safeMode
        };
      } else {
        controllerMonitorDictionary = {
          id: controller.id,
          progress: controller.progress,
          nextLevel: controller.progressTotal,
          downgrade: controller.ticksToDowngrade,
          safeMode: false
        };
      }
      room.memory.monitoring.structures.controller = controllerMonitorDictionary;
    }
  }
}
