export class GameMonitor {
  public constructor() {
    this.monitorGame();
  }
  private monitorGame() {
    Memory.monitoring = {
      cpu: {
        used: Game.cpu.getUsed(),
        bucket: Game.cpu.bucket
      },
      memory: this.monitorHeapSize(),
      pixels: (Game.resources.pixel as number) || 0
    };
  }
  private monitorHeapSize(): number {
    let curHeapSize = 0;
    if (Game.cpu.getHeapStatistics) {
      const heapStats = Game.cpu.getHeapStatistics();
      if (heapStats) {
        curHeapSize = heapStats.used_heap_size;
      }
    }
    return curHeapSize;
  }
}
