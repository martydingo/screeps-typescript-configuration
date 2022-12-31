export {};
declare global {
  interface FactoryMonitorMemory {
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
    id: Id<StructureFactory>;
  }
}
