export {};
declare global {
  interface RoadMonitorMemory {
    [roadId: Id<StructureRoad>]: {
      structure: {
        hits: number;
        hitsMax: number;
      };
    };
  }
}
