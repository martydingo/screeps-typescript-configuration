export {};
declare global {
  interface LabQueueMemory {
    [labJobUUID: string]: {
      labJobType: "feedLabEnergy" | "feedLabXGH20";
      labId: Id<StructureLab>;
      priority: number;
    };
  }
}
