export {};
declare global {
  interface LabMonitorMemory {
    [storageId: Id<StructureLab>]: {
      resources: {
        [resourceName: string]: {
          amount: number;
        };
      };
      structure: {
        hits: number;
        hitsMax: number;
      };
      cooldown: number;
      mode?: string;
    };
  }
}
