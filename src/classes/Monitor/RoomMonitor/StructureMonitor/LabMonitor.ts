import { profile } from "Profiler";
@profile
export class LabMonitor {
  public constructor(lab: StructureLab) {
    this.initalizeLabMonitorMemory(lab);
    this.monitorLabs(lab);
  }
  private initalizeLabMonitorMemory(lab: StructureLab) {
    if (!lab.room.memory.monitoring.structures.labs) {
      lab.room.memory.monitoring.structures.labs = {};
    }
  }
  private monitorLabs(lab: StructureLab): void {
    if (lab) {
      if (lab.room.memory.monitoring.structures.labs) {
        const labStorage: { [resourceName: string]: { amount: number } } = {};
        Object.entries(lab.store).forEach(([resourceName]) => {
          const resourceNameTyped = resourceName as ResourceConstant;
          labStorage[resourceName] = { amount: lab.store[resourceNameTyped] };
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        lab.room.memory.monitoring.structures.labs[lab.id] = {
          resources: labStorage,
          structure: {
            hits: lab.hits,
            hitsMax: lab.hitsMax
          },
          cooldown: lab.cooldown
        };
      }
    }
  }
}
