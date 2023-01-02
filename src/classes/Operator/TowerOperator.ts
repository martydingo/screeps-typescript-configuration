import { profile } from "Profiler";
import { FeedTowerJob } from "classes/Job/FeedTowerJob";
import { fetchHostileCreep } from "common/fetchHostileCreep";

@profile
export class TowerOperator {
  public constructor() {
    if (Memory.rooms) {
      Object.entries(Memory.rooms).forEach(([roomName]) => {
        const towersInMemory = Memory.rooms[roomName].monitoring.structures.towers;
        if (towersInMemory) {
          Object.entries(towersInMemory).forEach(([towerIdString]) => {
            const towerId = towerIdString as Id<StructureTower>;
            const tower = Game.getObjectById(towerId);
            if (tower) {
              this.createTowerFeederJob(tower);
              this.operateTowers(tower);
            }
          });
        }
      });
    }
  }
  private createTowerFeederJob(tower: StructureTower) {
    const jobParameters: FeedTowerJobParameters = {
      status: "fetchingResource",
      room: tower.room.name,
      jobType: "feedTower",
      towerId: tower.id
    };
    new FeedTowerJob(jobParameters);
  }
  private operateTowers(tower: StructureTower): void {
    if (!this.attackHostiles(tower)) {
      this.repairRoads(tower);
    }
  }
  private attackHostiles(tower: StructureTower): boolean {
    const hostileCreep = fetchHostileCreep(tower.room);
    if (hostileCreep) {
      const attackResult = tower.attack(hostileCreep);
      console.log(`Attack result on ${hostileCreep.name}: ${attackResult}`);
      if (attackResult === OK) {
        return true;
      }
    }
    return false;
  }
  private repairRoads(tower: StructureTower): void {
    const roadsInMemory: RoadMonitorMemory | undefined = tower.room.memory.monitoring.structures.roads;
    if (roadsInMemory) {
      const roadToRepairObject = Object.entries(roadsInMemory).sort(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ([, cachedRoadA], [, cachedRoadB]) => cachedRoadA.structure.hits - cachedRoadB.structure.hits
      );
      if (roadToRepairObject[0]) {
        const roadToRepairId = roadToRepairObject[0][0] as Id<StructureRoad>;
        const roadToRepair = Game.getObjectById(roadToRepairId);
        if (roadToRepair) {
          tower.repair(roadToRepair);
        } else {
          delete Memory.rooms[tower.pos.roomName].monitoring.structures.roads[roadToRepairId];
        }
      }
    }
  }
}
