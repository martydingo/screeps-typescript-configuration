export {};
declare global {
  interface FeedTowerJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom?: string;
    jobType: "feedTower";
    towerId: Id<StructureTower>;
  }
}
