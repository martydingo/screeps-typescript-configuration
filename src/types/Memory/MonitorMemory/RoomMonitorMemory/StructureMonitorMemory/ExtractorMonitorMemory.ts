export {};
declare global {
  interface ExtractorMonitorMemory {
    [extractorId: Id<StructureExtractor>]: {
      structure: {
        hits: number;
        hitsMax: number;
      };
    };
  }
}
