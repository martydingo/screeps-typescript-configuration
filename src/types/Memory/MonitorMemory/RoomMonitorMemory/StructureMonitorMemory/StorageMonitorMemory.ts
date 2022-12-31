export {};
declare global {
  interface StorageMonitorMemory {
    id: Id<StructureStorage>;
    resources: {
      [resourceName: string]: {
        resourceAmount: number;
        resourceCapacity: number;
      };
    };
    structure: {
      hits: number;
      hitsMax: number;
    };
  }
}
