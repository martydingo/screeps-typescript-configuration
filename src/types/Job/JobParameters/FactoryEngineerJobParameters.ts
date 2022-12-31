export {};
declare global {
  interface FactoryEngineerJobParameters {
    uuid?: string;
    room: string;
    spawnRoom?: string;
    status: string;
    jobType: "factoryEngineer";
    factoryId: Id<StructureFactory>;
  }
}
