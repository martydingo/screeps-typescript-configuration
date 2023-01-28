import { profile } from "Profiler";
import { FeedSpawnJob } from "classes/Job/FeedSpawnJob";
import { Log } from "classes/Log";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { creepPriority } from "configuration/creeps/creepPriority";
import { creepNumbersOverride } from "configuration/rooms/creepNumbersOverride";

@profile
export class SpawnOperator {
  public constructor() {
    this.createSpawnFeederJobs();
    Object.entries(Memory.rooms).forEach(([roomName]) => {
      this.operateSpawns(roomName);
    });
  }

  private operateSpawns(roomName: string) {
    if (Memory.rooms[roomName].queues.spawnQueue) {
      const sortedRoomSpawnQueue = Object.entries(Memory.rooms[roomName].queues.spawnQueue).sort(
        ([, spawnQueueEntryA], [, spawnQueueEntryB]) =>
          creepPriority(Game.rooms[roomName])[spawnQueueEntryA.creepType] -
          creepPriority(Game.rooms[roomName])[spawnQueueEntryB.creepType]
      );
      let spawn: StructureSpawn | null = null;
      if (sortedRoomSpawnQueue.length > 0) {
        const nextSpawnJob = sortedRoomSpawnQueue[0][1];
        let spawnRoom = nextSpawnJob.room;
        if (nextSpawnJob.jobParameters.spawnRoom) {
          const spawnRoomString = nextSpawnJob.spawnRoom;
          if (spawnRoomString) {
            spawnRoom = spawnRoomString;
          }
        }

        const spawnObjects = Object.entries(Game.spawns).filter(
          ([, Spawn]) => Spawn.spawning === null && Spawn.pos.roomName === spawnRoom
        );
        if (spawnObjects.length > 0) {
          spawn = spawnObjects[0][1];
        }
        if (spawn) {
          const spawnResult: ScreepsReturnCode = spawn.spawnCreep(nextSpawnJob.bodyParts, nextSpawnJob.name, {
            memory: nextSpawnJob.jobParameters
          });
          Log.Debug(`Spawn result for ${nextSpawnJob.creepType} in room ${spawnRoom}: ${spawnResult}`);
          if (spawnResult === OK) {
            delete Memory.rooms[spawnRoom].queues.spawnQueue[nextSpawnJob.uuid];
            delete Memory.queues.spawnQueue[nextSpawnJob.uuid];
          }
        } else {
          const AllSpawnObjects = Object.entries(Game.spawns).filter(([, Spawn]) => Spawn.pos.roomName === spawnRoom);
          if (AllSpawnObjects.length < 1) {
            Log.Emergency(
              "::: !!! ::: Spawn object is null! All spawning currently halted in an error state! ::: !!! :::"
            );
            Log.Debug(`::: !!! :::  spawnRoom: ${spawnRoom} ::: !!! :::`);
            Log.Debug(`::: !!! :::  nextSpawnJob Parameters: ${JSON.stringify(nextSpawnJob)} ::: !!! :::`);
          } else {
            Log.Warning(
              `While attempting to spawn a ${nextSpawnJob.jobParameters.jobType} creep, it was discovered that all spawners in ${spawnRoom} are spawning`
            );
          }
        }
      }
    } else {
      Log.Emergency(`No spawn queue discovered in Memory.rooms[${roomName}].queues.spawnQueues`);
    }
  }
  private createSpawnFeederJobs() {
    Object.entries(Game.spawns).forEach(([, spawn]) => {
      const JobParameters: FeedSpawnJobParameters = {
        status: "fetchingResource",
        room: spawn.pos.roomName,
        jobType: "feedSpawn"
      };
      let count: number = creepNumbers[JobParameters.jobType];
      if (creepNumbersOverride[JobParameters.room]) {
        if (creepNumbersOverride[JobParameters.room][JobParameters.jobType]) {
          count = creepNumbers[JobParameters.jobType] + creepNumbersOverride[JobParameters.room][JobParameters.jobType];
        }
      }

      new FeedSpawnJob(JobParameters, count);
    });
  }
}
