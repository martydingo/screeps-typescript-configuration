import { QueueMemoryController } from "./MemoryController/QueueMemoryController";
import { RoomMemoryController } from "./MemoryController/RoomMemoryController";
import { roomOperations } from "common/roomOperations";
import { Log } from "./Log";

export class MemoryController {
  public constructor() {
    this.maintainMemory();
  }
  private maintainMemory() {
    this.maintainQueueMemory();
    this.maintainRoomMemory();
    this.maintainCreepMemory();
  }
  private maintainQueueMemory() {
    new QueueMemoryController();
  }
  private maintainCreepMemory() {
    if (!Memory.creeps) {
      Memory.creeps = {};
    } else {
      for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
          Log.Debug(`Clearing ${name} Creep Memory`);
          delete Memory.creeps[name];
        }
      }
    }
  }
  private maintainRoomMemory() {
    if (!Memory.rooms) {
      Memory.rooms = {};
    }
    const roomsToAddToMemory = roomOperations.generateRoomsArray();
    roomsToAddToMemory.forEach(roomName => {
      new RoomMemoryController(roomName);
    });
  }
}
