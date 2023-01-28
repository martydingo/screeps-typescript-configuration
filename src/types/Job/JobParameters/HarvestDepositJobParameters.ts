export {};
declare global {
  interface HarvestDepositJobParameters {
    uuid?: string;
    status: string;
    room: string;
    spawnRoom: string;
    jobType: "harvestDeposit";
    depositId: Id<Deposit>;
    storage: Id<StructureStorage>;
  }
}
