export class PathFinderMemoryController {
  public constructor() {
    this.maintainPathFinderMemoryHealth();
  }
  private maintainPathFinderMemoryHealth(): void {
    if (!Memory.pathFinding) {
      this.initializePathFinderMemory();
    }
  }
  private initializePathFinderMemory(): void {
    Memory.pathFinding = {
      pathCache: {}
    };
  }
}
