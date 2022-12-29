export {};

declare global {
  interface RoomMonitorMemory {
    constructionSites: ConstructionSiteMonitorMemory;
    droppedResources: DroppedResourceMonitorMemory;
    energy: EnergyMonitorMemory;
    hostiles: HostileMonitorMemory;
    sources: SourceMonitorMemory;
    structures: StructureMonitorMemory;
  }
}
