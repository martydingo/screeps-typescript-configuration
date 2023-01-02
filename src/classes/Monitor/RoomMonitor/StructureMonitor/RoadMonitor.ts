import { profile } from "Profiler";
@profile
export class RoadMonitor {
  public constructor(road: StructureRoad) {
    this.initalizeRoadMonitorMemory(road);
    this.monitorRoads(road);
  }
  private initalizeRoadMonitorMemory(road: StructureRoad) {
    if (!road.room.memory.monitoring.structures.roads) {
      road.room.memory.monitoring.structures.roads = {};
    }
  }
  private monitorRoads(road: StructureRoad): void {
    if (road.room.memory.monitoring.structures.roads) {
      road.room.memory.monitoring.structures.roads[road.id] = {
        structure: {
          hits: road.hits,
          hitsMax: road.hitsMax
        }
      };
    }
  }
}
