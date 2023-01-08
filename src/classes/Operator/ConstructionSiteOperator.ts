import { profile } from "Profiler";
import { BuildConstructionSiteJob } from "classes/Job/BuildConstructionSiteJob";
import { findPath } from "common/findPath";
import { creepNumbers } from "configuration/creeps/creepNumbers";

@profile
export class ConstructionSiteOperator {
  public constructor() {
    this.operateConstructionSites();
  }
  private cleanConstructionSites(roomName: string) {
    if (Object.entries(Memory.rooms[roomName].monitoring.constructionSites).length === 0) {
      this.deleteConstructionSiteJob(roomName);
    } else {
      Object.entries(Memory.rooms[roomName].monitoring.constructionSites).forEach(([constructionSiteIdString]) => {
        const constructionSiteId = constructionSiteIdString as Id<ConstructionSite>;
        const constructionSite = Game.getObjectById(constructionSiteId);
        if (!constructionSite) {
          delete Memory.rooms[roomName].monitoring.constructionSites[constructionSiteId];
        }
      });
    }
  }
  private createConstructionSiteJob(roomName: string) {
    let spawnRoom = roomName;
    if (Object.entries(Memory.rooms[roomName].monitoring.structures.spawns).length === 0) {
      spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
    }
    const JobParameters: BuildConstructionSiteJobParameters = {
      status: "fetchingResource",
      room: roomName,
      spawnRoom,
      jobType: "buildConstructionSite"
    };
    const count: number = creepNumbers[JobParameters.jobType];
    new BuildConstructionSiteJob(JobParameters, count);
  }
  private deleteConstructionSiteJob(roomName: string) {
    let spawnRoom = roomName;
    if (
      Object.entries(Memory.rooms[roomName].monitoring.structures.spawns).filter(
        ([, spawn]) => spawn.structure.hits > 0
      ).length === 0
    ) {
      spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
    }
    const JobParameters: BuildConstructionSiteJobParameters = {
      status: "fetchingResource",
      room: roomName,
      spawnRoom,
      jobType: "buildConstructionSite"
    };
    new BuildConstructionSiteJob(JobParameters, 0);
  }
  private operateConstructionSites() {
    if (Memory.rooms) {
      for (const roomName in Memory.rooms) {
        this.cleanConstructionSites(roomName);
        const constructionSitesInRoom = Object.entries(Memory.rooms[roomName].monitoring.constructionSites);
        if (constructionSitesInRoom.length > 0) {
          this.createConstructionSiteJob(roomName);
        }
      }
    }
  }
}
