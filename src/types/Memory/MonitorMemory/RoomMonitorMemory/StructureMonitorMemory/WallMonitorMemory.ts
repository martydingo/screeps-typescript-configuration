export {};
declare global {
  interface WallMonitorMemory {
    [wallId: Id<StructureWall>]: {
      structure: {
        hits: number;
        hitsMax: number;
      };
    };
  }
}
