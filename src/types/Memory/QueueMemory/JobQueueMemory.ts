export {};
declare global {
  interface JobQueueMemory {
    [UUID: string]: {
      uuid?: string;
      index: number;
      jobParameters:
        | MineSourceJobParameters
        | FeedSpawnJobParameters
        | FeedTowerJobParameters
        | FeedLinkJobParameters
        | UpgradeControllerJobParameters
        | BuildConstructionSiteJobParameters
        | LootResourceJobParameters
        | ScoutRoomJobParameters
        | TankRoomJobParameters
        | ClaimRoomJobParameters
        | ReserveRoomJobParameters
        | TransportResourceJobParameters
        | TerminalEngineerJobParameters
        | LabEngineerJobParameters
        | FactoryEngineerJobParameters
        | DefendRoomJobParameters
        | DismantleEnemyBuildingsJobParameters;

      jobType: string;
      timeAdded: Game["time"];
      assignedCreep?: Id<Creep>;
      room: string;
    };
  }
}
