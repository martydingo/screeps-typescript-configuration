export {};
declare global {
  interface DepositMonitorMemory {
    depositId: Id<Deposit>;
    depositType: DepositConstant;
    cooldown: number;
  }
}
