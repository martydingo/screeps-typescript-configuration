export {};
declare global {
  interface ClaimRoomJobParameters {
    uuid?: string;
    room: string;
    status: string;
    spawnRoom?: string;
    jobType: "claimRoom";
  }
}
