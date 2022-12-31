export {};
declare global {
  interface ReserveRoomJobParameters {
    uuid?: string;
    room: string;
    status: string;
    spawnRoom?: string;
    jobType: "reserveRoom";
  }
}
