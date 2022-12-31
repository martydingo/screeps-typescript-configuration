import { LootResourceJob } from "classes/Job/LootResourceJob";
import { creepNumbers } from "configuration/creeps/creepNumbers";

export class DroppedResourceMonitor {
  private room: Room;
  public constructor(room: Room) {
    this.room = room;
    if (this.room) {
      this.initializeDroppedResourceMonitorMemory();
      this.monitorDroppedResources();
      this.cleanDroppedResources();
      this.createLootResourceJob();
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
  private createLootResourceJob(): void {
    if (this.room.memory.monitoring.structures.storage) {
      if (Object.entries(this.room.memory.monitoring.droppedResources).length > 0) {
        const jobParameters: LootResourceJobParameters = {
          room: this.room.name,
          status: "fetchingResource",
          jobType: "lootResource"
        };
        const count: number = creepNumbers[jobParameters.jobType];
        new LootResourceJob(jobParameters, count);
      }
    }
  }
}
