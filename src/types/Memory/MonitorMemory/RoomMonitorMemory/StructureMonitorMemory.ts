export {};
declare global {
  interface StructureMonitorMemory {
    controller?: ControllerMonitorMemory;
    terminal?: TerminalMonitorMemory;
    factory?: FactoryMonitorMemory;
    extensions: ExtensionMonitorMemory;
    extractors: ExtractorMonitorMemory;
    labs: LabMonitorMemory;
    spawns: SpawnMonitorMemory;
    towers: TowerMonitorMemory;
    storage?: StorageMonitorMemory;
    containers: ContainerMonitorMemory;
    roads: RoadMonitorMemory;
    links: LinkMonitorMemory;
    walls: WallMonitorMemory;
    other: {
      [structuredId: Id<Structure>]: {
        structureType: StructureConstant;
      };
    };
  }
}
