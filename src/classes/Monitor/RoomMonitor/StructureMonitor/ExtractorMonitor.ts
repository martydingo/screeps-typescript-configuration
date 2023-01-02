import { profile } from "Profiler";
@profile
export class ExtractorMonitor {
  public constructor(extractor: StructureExtractor) {
    this.initalizeExtractorMonitorMemory(extractor);
    this.monitorExtractors(extractor);
  }
  private initalizeExtractorMonitorMemory(extractor: StructureExtractor) {
    if (!extractor.room.memory.monitoring.structures.extractors) {
      extractor.room.memory.monitoring.structures.extractors = {};
    }
  }
  private monitorExtractors(extractor: StructureExtractor): void {
    if (extractor) {
      if (extractor.room.memory.monitoring.structures.extractors) {
        extractor.room.memory.monitoring.structures.extractors[extractor.id] = {
          structure: {
            hits: extractor.hits,
            hitsMax: extractor.hitsMax
          }
        };
      }
    }
  }
}
