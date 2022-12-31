export class ExtensionMonitor {
  public room: Room;

  public constructor(room: Room) {
    this.room = room;
    this.initalizeExtensionMonitorMemory();
    this.monitorExtensions();
  }
  private initalizeExtensionMonitorMemory() {
    if (!this.room.memory.monitoring.extensions) {
      this.room.memory.monitoring.extensions = {};
    }
  }
  private monitorExtensions(): void {
    const extensions: StructureExtension[] = this.room
      .find(FIND_MY_STRUCTURES)
      .filter(Structure => Structure.structureType === STRUCTURE_EXTENSION) as StructureExtension[];
    extensions.forEach(extension => {
      this.room.memory.monitoring.extensions[extension.id] = {
        energy: extension.store[RESOURCE_ENERGY],
        capacity: extension.store.getCapacity(RESOURCE_ENERGY)
      };
    });
  }
}
