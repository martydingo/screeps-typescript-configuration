import { profile } from "Profiler";
import { BaseCreep } from "classes/BaseCreep";

@profile
export class LootResourceCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      const resourceArray: Resource<ResourceConstant>[] = [];
      Object.entries(creep.room.memory.monitoring.droppedResources).forEach(([resourceIdString]) => {
        const resourceId = resourceIdString as Id<Resource<ResourceConstant>>;
        const resource = Game.getObjectById(resourceId);
        if (resource) {
          resourceArray.push(resource);
        }
      });
      const nearestResource = creep.pos.findClosestByPath(resourceArray);
      if (nearestResource) {
        this.pickupResource(creep, nearestResource);
      }
    } else if (creep.memory.status === "working") {
      if (creep.room.memory.monitoring.structures.storage) {
        const storage = Game.getObjectById(creep.room.memory.monitoring.structures.storage.id);
        if (storage) {
          Object.entries(creep.store).forEach(([resourceConstantString]) => {
            const resourceConstant = resourceConstantString as ResourceConstant;
            this.depositResource(creep, storage, resourceConstant);
          });
        }
      }
    }
  }
}
