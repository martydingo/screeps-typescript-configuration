export {};
declare global {
  interface ScoutRoomJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom?: string;
    jobType: "scoutRoom";
  }
}
