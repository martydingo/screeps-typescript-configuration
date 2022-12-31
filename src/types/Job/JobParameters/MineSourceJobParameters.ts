export {};
declare global {
  interface MineSourceJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom: string;
    jobType: "mineSource";
    sourceId: Id<Source>;
  }
}
