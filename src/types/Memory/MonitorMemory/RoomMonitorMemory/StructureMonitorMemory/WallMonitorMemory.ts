export {};
declare global {
  interface WallMonitorMemory {
    [roadId: Id<StructureWall>]: {
      structure: {
        hits: number;
        hitsMax: number;
      };
    };
  }
}
