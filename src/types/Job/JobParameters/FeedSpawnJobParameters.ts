export {};
declare global {
  interface FeedSpawnJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom?: string;
    jobType: "feedSpawn";
  }
}
