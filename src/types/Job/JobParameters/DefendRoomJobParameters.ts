export {};
declare global {
  interface DefendRoomJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom?: string;
    jobType: "defendRoom";
  }
}
