export {};
declare global {
  interface TransportResourceJobParameters {
    uuid?: string;
    room: string;
    spawnRoom?: string;
    status: string;
    jobType: "transportResource";
    resourceType: ResourceConstant;
    storage: Id<StructureStorage> | Id<StructureContainer>;
  }
}
