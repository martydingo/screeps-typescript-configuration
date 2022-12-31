import { creepPriority } from "configuration/creeps/creepPriority";

export class SpawnQueueOperator {
  public constructor() {
    this.generateRoomSpawnQueues();
  }
  private generateRoomSpawnQueues() {
    const sortedSpawnQueue = Object.entries(Memory.queues.spawnQueue).sort(([, spawnJobA], [, spawnJobB]) => {
      return (
        creepPriority(Game.rooms[spawnJobA.room])[spawnJobA.creepType] -
        creepPriority(Game.rooms[spawnJobB.room])[spawnJobB.creepType]
      );
    });
    if (sortedSpawnQueue.length > 0) {
      Object.entries(sortedSpawnQueue).forEach(([, roomSpawnQueue]) => {
        let roomSpawnQueueSpawnRoom = roomSpawnQueue[1].room;
        if (roomSpawnQueue[1].spawnRoom) {
          roomSpawnQueueSpawnRoom = roomSpawnQueue[1].spawnRoom;
        }
        if (!Memory.rooms[roomSpawnQueueSpawnRoom].queues.spawnQueue) {
          Memory.rooms[roomSpawnQueueSpawnRoom].queues.spawnQueue = {};
        }
        Memory.rooms[roomSpawnQueueSpawnRoom].queues.spawnQueue[roomSpawnQueue[0]] = roomSpawnQueue[1];
      });
    }
  }
}
