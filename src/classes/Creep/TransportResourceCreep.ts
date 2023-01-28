import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class TransportResourceCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      if (creep.pos.roomName !== creep.memory.room) {
        this.moveHome(creep);
        creep.memory.status = "fetchingResource";
      } else {
        if (!creep.memory.resourceOrigin) {
          const droppedResourceArray: Resource[] = [];
          Object.entries(creep.room.memory.monitoring.droppedResources)
            .filter(([, DroppedResource]) => DroppedResource.resourceType === creep.memory.resourceType)
            .forEach(([resourceIdString]) => {
              const resourceId = resourceIdString as Id<Resource<ResourceConstant>>;
              const resource = Game.getObjectById(resourceId);
              if (resource) {
                droppedResourceArray.push(resource);
              }
            });
          const largestResource = droppedResourceArray.sort(
            (droppedResourceA, droppedResourceB) => droppedResourceB.amount - droppedResourceA.amount
          )[0];
          if (largestResource) {
            this.pickupResource(creep, largestResource);
          }
        } else {
          const resourceContainer = Game.getObjectById(creep.memory.resourceOrigin);
          if (resourceContainer) {
            if (creep.memory.resourceType) {
              this.withdrawResource(creep, resourceContainer, creep.memory.resourceType);
            }
          }
        }
      }
    } else if (creep.memory.status === "working") {
      if (creep.memory.storage) {
        const storage = Game.getObjectById(creep.memory.storage);
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
