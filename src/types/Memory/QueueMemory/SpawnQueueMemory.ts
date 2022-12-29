export {};
declare global {
  interface SpawnQueueMemory {
    [UUID: string]: {
      uuid: string;
      name: string;
      room: string;
      spawnRoom?: string;
      creepType: string;
      bodyParts: BodyPartConstant[];
      jobParameters:
        | MineSourceJobParameters
        | FeedSpawnJobParameters
        | FeedTowerJobParameters
        | FeedLinkJobParameters
        | UpgradeControllerJobParameters
        | BuildConstructionSiteJobParameters
        | LootResourceJobParameters
        | ScoutRoomJobParameters
        | ClaimRoomJobParameters
        | ReserveRoomJobParameters
        | TransportResourceJobParameters;
    };
  }
}
