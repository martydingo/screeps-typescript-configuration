import { profile } from "Profiler";
@profile
export class RuinMonitor {
  public constructor(ruin: Ruin) {
    this.initalizeRuinMonitorMemory(ruin);
    this.monitorRuins(ruin);
  }
  private initalizeRuinMonitorMemory(ruin: Ruin) {
    if (ruin.room) {
      if (!ruin.room.memory.monitoring.structures.ruins) {
        ruin.room.memory.monitoring.structures.ruins = {};
      }
    }
  }
  private monitorRuins(ruin: Ruin): void {
    if (ruin) {
      if (ruin.room) {
        if (ruin.room.memory.monitoring.structures.ruins) {
          const ruinStorage: { [resourceName: string]: { amount: number } } = {};
          Object.entries(ruin.store).forEach(([resourceName]) => {
            const resourceNameTyped = resourceName as ResourceConstant;
            ruinStorage[resourceName] = { amount: ruin.store[resourceNameTyped] };
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ruin.room.memory.monitoring.structures.ruins[ruin.id] = {
            resources: ruinStorage,
            remainingTime: ruin.destroyTime - Game.time
          };
        }
      }
    }
  }
}
