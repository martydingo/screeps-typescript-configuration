export {};
declare global {
  interface TankRoomJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom?: string;
    jobType: "tankRoom";
  }
}
