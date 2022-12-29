export {};
declare global {
  interface LabEngineerJobParameters {
    uuid?: string;
    room: string;
    spawnRoom?: string;
    status: string;
    jobType: "labEngineer";
  }
}
