export {};
declare global {
  interface ContainerMonitorMemory {
    [storageId: Id<StructureContainer>]: {
      resources: {
        [resourceName: string]: {
          amount: number;
        };
      };
      structure: {
        hits: number;
        hitsMax: number;
      };
    };
  }
}
