export {};
declare global {
  interface BuildConstructionSiteJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom: string;
    jobType: "buildConstructionSite";
  }
}
