export {};
declare global {
  interface StructureMonitorMemory {
    controller?: ControllerMonitorMemory;
    terminal?: TerminalMonitorMemory;
    labs: LabMonitorMemory;
    spawns: SpawnMonitorMemory;
    extensions: ExtensionMonitorMemory;
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
