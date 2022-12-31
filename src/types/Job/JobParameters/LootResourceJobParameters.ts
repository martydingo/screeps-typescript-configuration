export {};
declare global {
  interface LootResourceJobParameters {
    uuid?: string;
    room: string;
    spawnRoom?: string;
    status: string;
    jobType: "lootResource";
  }
}
