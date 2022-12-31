export {};

declare global {
  interface MonitorMemory {
    [RoomName: string]: {
      energy: EnergyMonitorMemory;
      controller?: ControllerMonitorMemory;
      sources: SourceMonitorMemory;
      spawns: {
        [spawnName: string]: SpawnMonitorMemory;
      };
      spawnQueue: SpawnQueueMemory;
      constructionSites: ConstructionSiteMonitorMemory;
      extensions: ExtensionMonitorMemory;
      structures: StructureMonitorMemory;
    };
  }
}
