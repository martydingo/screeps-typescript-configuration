export {};

declare global {
  export interface CreepMemory {
    status: string;
    jobType:
      | "mineSource"
      | "feedSpawn"
      | "feedTower"
      | "feedLink"
      | "upgradeController"
      | "buildConstructionSite"
      | "lootResource"
      | "scoutRoom"
      | "tankRoom"
      | "claimRoom"
      | "reserveRoom"
      | "transportResource"
      | "terminalEngineer"
      | "labEngineer"
      | "factoryEngineer"
      | "defendRoom"
      | "dismantleEnemyBuildings"
      | "harvestDeposit";
    sourceId?: Id<Source>;
    towerId?: Id<StructureTower>;
    controllerId?: Id<StructureController>;
    linkId?: Id<StructureLink>;
    room: string;
    resourceType?: ResourceConstant;
    resourceOrigin?: Id<Ruin>;
    storage?: Id<StructureStorage> | Id<StructureContainer>;
    terminalJobUUID?: string;
    labJobUUID?: string;
    factoryJobUUID?: string;
    safeRoute?: RoomPosition[];
    depositId?: Id<Deposit>;
    cache?: {
      dropEnergy?: boolean;
    };
  }
}
