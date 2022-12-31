export class MineralMonitor {
  public mineralId: Id<Mineral>;

  public constructor(mineralId: Id<Mineral>) {
    this.mineralId = mineralId;
    this.monitorMineral();
  }

  public monitorMineral(): void {
    const mineral: Mineral | null = Game.getObjectById(this.mineralId);
    if (mineral) {
      const roomName: string = mineral.pos.roomName;
      Memory.rooms[roomName].monitoring.minerals[this.mineralId] = {
        remainingMineral: mineral.mineralAmount,
        mineralType: mineral.mineralType
      };
    }
  }
}
