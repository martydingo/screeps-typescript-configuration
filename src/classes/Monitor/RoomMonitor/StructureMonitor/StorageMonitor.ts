import { profile } from "Profiler";
@profile
export class StorageMonitor {
  public constructor(storage: StructureStorage) {
    this.monitorStorage(storage);
  }
  private monitorStorage(storage: StructureStorage) {
    if (storage) {
      storage.room.memory.monitoring.structures.storage = {
        id: storage.id,
        resources: {},
        structure: {
          hits: storage.hits,
          hitsMax: storage.hitsMax
        }
      };
      Object.entries(storage.store).forEach(([resourceTypeString]) => {
        const resourceType = resourceTypeString as ResourceConstant;
        if (storage.room.memory.monitoring.structures.storage) {
          storage.room.memory.monitoring.structures.storage.resources[resourceTypeString] = {
            resourceAmount: storage.store[resourceType],
            resourceCapacity: storage.store.getCapacity(resourceType)
          };
        }
      });
    }
  }
}
