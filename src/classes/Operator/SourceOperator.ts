import { profile } from "Profiler";
import { MineSourceJob } from "classes/Job/MineSourceJob";
import { TransportResourceJob } from "classes/Job/TransportResourceJob";
import { Log } from "classes/Log";
import { findPath } from "common/findPath";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { myScreepsUsername } from "configuration/user";
import { creepNumbersOverride } from "configuration/rooms/creepNumbersOverride";

@profile
export class SourceOperator {
  public constructor() {
    this.operateSources();
  }
  private operateSources() {
    if (Memory.rooms) {
      for (const roomName in Memory.rooms) {
        for (const sourceIdString in Memory.rooms[roomName].monitoring.sources) {
          const sourceId: Id<Source> = sourceIdString as Id<Source>;
          const source: Source | null = Game.getObjectById(sourceId);
          if (source) {
            if (source.room.controller?.my || source.room.controller?.reservation?.username === myScreepsUsername) {
              this.createSourceMinerJob(source);
              if (!source.room.controller?.my) {
                this.createTransportEnergyJob(source);
              }
            }
          }
        }
      }
    }
  }
  private createSourceMinerJob(source: Source) {
    let spawnRoom = source.pos.roomName;
    if (Object.entries(source.room.memory.monitoring.structures.spawns).length === 0) {
      spawnRoom = findPath.findClosestSpawnToRoom(source.pos.roomName).pos.roomName;
    }

    const JobParameters: MineSourceJobParameters = {
      status: "fetchingResource",
      spawnRoom,
      room: source.pos.roomName,
      jobType: "mineSource",
      sourceId: source.id
    };
    const count: number = creepNumbers[JobParameters.jobType];
    new MineSourceJob(JobParameters, count);
  }
  private createTransportEnergyJob(source: Source) {
    const spawnRoom = findPath.findClosestSpawnToRoom(source.pos.roomName).room;
    let storage: StructureStorage | undefined;
    if (spawnRoom) {
      if (spawnRoom.storage) storage = spawnRoom.storage;
    } else {
      const findStorageResult = findPath.findClosestStorageToRoom(source.pos.roomName);
      if (findStorageResult) {
        storage = findStorageResult;
      }
    }
    if (storage) {
      const JobParameters: TransportResourceJobParameters = {
        status: "fetchingResource",
        spawnRoom: spawnRoom.name,
        room: source.pos.roomName,
        jobType: "transportResource",
        resourceType: RESOURCE_ENERGY,
        storage: storage.id
      };
      let count: number = creepNumbers[JobParameters.jobType];
      if (creepNumbersOverride[JobParameters.room]) {
        if (creepNumbersOverride[JobParameters.room][JobParameters.jobType]) {
          count = creepNumbers[JobParameters.jobType] + creepNumbersOverride[JobParameters.room][JobParameters.jobType];
        }
      }
      new TransportResourceJob(JobParameters, count);
    } else {
      Log.Alert(`TransportResource Job for source ${source.id} cannot find any storage nearby ${source.pos.roomName}!`);
    }
  }
}
