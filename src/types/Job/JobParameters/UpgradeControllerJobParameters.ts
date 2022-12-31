export {};
declare global {
  interface UpgradeControllerJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom: string;
    jobType: "upgradeController";
    controllerId: Id<StructureController>;
  }
}
