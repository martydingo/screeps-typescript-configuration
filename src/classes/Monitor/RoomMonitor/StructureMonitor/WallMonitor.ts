import { profile } from "Profiler";
@profile
export class WallMonitor {
  public constructor(wall: StructureWall) {
    this.initalizeWallMonitorMemory(wall);
    this.monitorWalls(wall);
  }
  private initalizeWallMonitorMemory(wall: StructureWall) {
    if (!wall.room.memory.monitoring.structures.walls) {
      wall.room.memory.monitoring.structures.walls = {};
    }
  }
  private monitorWalls(wall: StructureWall): void {
    if (wall) {
      if (wall.room.memory.monitoring.structures.walls) {
        wall.room.memory.monitoring.structures.walls[wall.id] = {
          structure: {
            hits: wall.hits,
            hitsMax: wall.hitsMax
          }
        };
      }
    }
  }
}
