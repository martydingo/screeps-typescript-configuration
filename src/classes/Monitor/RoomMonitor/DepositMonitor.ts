import { profile } from "Profiler";
@profile
export class DepositMonitor {
  public constructor(deposit: Deposit) {
    this.monitorDeposit(deposit);
  }

  public monitorDeposit(deposit: Deposit): void {
    if (deposit) {
      const room = deposit.room;
      if (room) {
        if (Memory.rooms[room.name]) {
          Memory.rooms[room.name].monitoring.deposit = {
            depositId: deposit.id,
            cooldown: deposit.cooldown,
            depositType: deposit.depositType
          };
        }
      }
    }
  }
}
