export {};
declare global {
  interface DismantleEnemyBuildingsJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom?: string;
    jobType: "dismantleEnemyBuildings";
  }
}
