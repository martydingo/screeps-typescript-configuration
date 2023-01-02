import { profile } from "Profiler";
@profile
export class ContainerMonitor {
  public constructor(container: StructureContainer) {
    this.initalizeContainerMonitorMemory(container);
    this.monitorContainers(container);
  }
  private initalizeContainerMonitorMemory(container: StructureContainer) {
    if (!container.room.memory.monitoring.structures.containers) {
      container.room.memory.monitoring.structures.containers = {};
    }
  }
  private monitorContainers(container: StructureContainer): void {
    if (container) {
      if (container.room.memory.monitoring.structures.containers) {
        const containerStorage: { [resourceName: string]: { amount: number } } = {};
        Object.entries(container.store).forEach(([resourceName]) => {
          const resourceNameTyped = resourceName as ResourceConstant;
          containerStorage[resourceName] = { amount: container.store[resourceNameTyped] };
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        container.room.memory.monitoring.structures.containers[container.id] = {
          resources: containerStorage,
          structure: {
            hits: container.hits,
            hitsMax: container.hitsMax
          }
        };
      }
    }
  }
}
