export class DroppedResourceMonitor {
  private room: Room;
  public constructor(room: Room) {
    this.room = room;
    if (this.room) {
      this.initializeDroppedResourceMonitorMemory();
      this.monitorDroppedResources();
      this.cleanDroppedResources();
    }
  }
  private initializeDroppedResourceMonitorMemory() {
    if (!this.room.memory.monitoring.droppedResources) {
      this.room.memory.monitoring.droppedResources = {};
    }
  }
  private monitorDroppedResources(): void {
    const droppedResources = this.room.find(FIND_DROPPED_RESOURCES);
    droppedResources.forEach(droppedResource => {
      this.room.memory.monitoring.droppedResources[droppedResource.id] = {
        resourceType: droppedResource.resourceType,
        amount: droppedResource.amount
      };
    });
  }
  private cleanDroppedResources(): void {
    Object.entries(this.room.memory.monitoring.droppedResources).forEach(([droppedResourceId]) => {
      const droppedResource = Game.getObjectById(droppedResourceId as Id<Resource<ResourceConstant>>);
      if (!droppedResource) {
        delete this.room.memory.monitoring.droppedResources[droppedResourceId as Id<Resource<ResourceConstant>>];
      }
    });
  }
}
