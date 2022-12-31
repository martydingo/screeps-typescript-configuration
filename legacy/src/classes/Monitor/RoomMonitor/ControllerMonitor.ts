export class ControllerMonitor {
  public controllerId: Id<StructureController>;

  public constructor(controllerId: Id<StructureController>) {
    this.controllerId = controllerId;
    this.monitorController();
  }

  public monitorController(): void {
    const controller: StructureController | null = Game.getObjectById(this.controllerId);
    if (controller) {
      const roomName: string = controller.pos.roomName;
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
      Memory.rooms[roomName].monitoring.structures.controller = controllerMonitorDictionary;
    }
  }
}
