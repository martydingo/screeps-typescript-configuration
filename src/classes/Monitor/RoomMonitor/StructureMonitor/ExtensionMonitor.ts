export class ExtensionMonitor {
  public constructor(extension: StructureExtension) {
    this.initalizeExtensionMonitorMemory(extension);
    this.monitorExtensions(extension);
  }
  private initalizeExtensionMonitorMemory(extension: StructureExtension) {
    if (!extension.room.memory.monitoring.structures.extensions) {
      extension.room.memory.monitoring.structures.extensions = {};
    }
  }
  private monitorExtensions(extension: StructureExtension): void {
    if (extension.room.memory.monitoring.structures.extensions) {
      extension.room.memory.monitoring.structures.extensions[extension.id] = {
        energyAvailable: extension.store[RESOURCE_ENERGY],
        energyCapacity: extension.store.getCapacity(RESOURCE_ENERGY)
      };
    }
  }
}
