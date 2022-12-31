import { fetchBodyParts } from "common/fetchBodyParts";

export class JobQueueOperator {
  public constructor() {
    this.processJobs();
  }
  private processJobs() {
    for (const jobUUID in Memory.queues.jobQueue) {
      let spawnRoom = Memory.queues.jobQueue[jobUUID].jobParameters.room;
      if (Memory.queues.jobQueue[jobUUID].jobParameters.spawnRoom) {
        const spawnRoomString = Memory.queues.jobQueue[jobUUID].jobParameters.spawnRoom;
        if (spawnRoomString) {
          spawnRoom = spawnRoomString;
        }
      }
      const desiredBodyParts = fetchBodyParts(Memory.queues.jobQueue[jobUUID].jobType, spawnRoom);
      // console.log(`${Memory.queues.jobQueue[jobUUID].jobType}: ${desiredBodyParts.toString()}`);
      if (!Memory.queues.spawnQueue[jobUUID]) {
        if (!this.checkCreep(jobUUID)) {
          Memory.queues.spawnQueue[jobUUID] = {
            name: jobUUID,
            uuid: jobUUID,
            creepType: Memory.queues.jobQueue[jobUUID].jobType,
            bodyParts: desiredBodyParts,
            room: Memory.queues.jobQueue[jobUUID].jobParameters.room,
            spawnRoom: Memory.queues.jobQueue[jobUUID].jobParameters.spawnRoom,
            jobParameters: Memory.queues.jobQueue[jobUUID].jobParameters
          };
        } else {
          if (this.checkCreep(jobUUID)) {
            delete Memory.queues.spawnQueue[jobUUID];
            delete Memory.rooms[spawnRoom].queues.spawnQueue[jobUUID];
          } else {
            if (Memory.queues.spawnQueue[jobUUID].bodyParts !== desiredBodyParts) {
              Memory.queues.spawnQueue[jobUUID].bodyParts = desiredBodyParts;
            }
          }
        }
      } else {
        if (this.checkCreep(jobUUID)) {
          delete Memory.queues.spawnQueue[jobUUID];
          delete Memory.rooms[spawnRoom].queues.spawnQueue[jobUUID];
        } else {
          if (Memory.queues.spawnQueue[jobUUID].bodyParts !== desiredBodyParts) {
            Memory.queues.spawnQueue[jobUUID].bodyParts = desiredBodyParts;
          }
        }
      }
    }
  }
  private checkCreep(UUID: string): boolean {
    if (Game.creeps[UUID]) {
      return true;
    } else {
      return false;
    }
  }
}
