export class EnergyMonitor {
  private room: Room;
  public constructor(room: Room) {
    this.room = room;
    if (this.room) {
      this.initializeEnergyMonitorMemory();
      this.monitorEnergy();
      this.cleanHistory();
    }
  }
  private initializeEnergyMonitorMemory(): void {
    if (!this.room.memory.monitoring.energy) {
      this.room.memory.monitoring.energy = {
        history: {}
      };
    }
  }
  private monitorEnergy(): void {
    this.room.memory.monitoring.energy.history[Game.time] = {
      energyAvailable: this.room.energyAvailable,
      energyCapacity: this.room.energyCapacityAvailable
    };
  }
  private cleanHistory(): void {
    const deleteThreshold = 100;
    const curTime = Game.time;
    Object.entries(this.room.memory.monitoring.energy.history).forEach(([monitorTimeString]) => {
      const monitorTimeUnknown = monitorTimeString as unknown;
      const monitorTime = monitorTimeUnknown as number;
      if (monitorTime < curTime - deleteThreshold) {
        delete this.room.memory.monitoring.energy.history[monitorTime];
      }
    });
  }
}
