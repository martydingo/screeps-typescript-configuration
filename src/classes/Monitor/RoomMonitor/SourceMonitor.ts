import { profile } from "Profiler";
@profile
export class SourceMonitor {
  public sourceId: Id<Source>;

  public constructor(sourceId: Id<Source>) {
    this.sourceId = sourceId;
    this.monitorSource();
  }

  public monitorSource(): void {
    const source: Source | null = Game.getObjectById(this.sourceId);
    if (source) {
      const roomName: string = source.pos.roomName;
      Memory.rooms[roomName].monitoring.sources[this.sourceId] = {
        totalEnergy: source.energyCapacity,
        remainingEnergy: source.energy
      };
    }
  }
}
