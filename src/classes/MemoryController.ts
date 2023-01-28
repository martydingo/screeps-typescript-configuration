import { QueueMemoryController } from "./MemoryController/QueueMemoryController";
import { RoomMemoryController } from "./MemoryController/RoomMemoryController";
import { PathFinderMemoryController } from "./MemoryController/PathFinderMemoryController";
import { roomOperations } from "common/roomOperations";
import { Log } from "./Log";
import { roomsToMonitor } from "configuration/rooms/roomsToMonitor";

export class MemoryController {
  public constructor() {
    this.maintainMemory();
  }
  private maintainMemory() {
    this.maintainPathMemory();
    this.maintainQueueMemory();
    this.maintainRoomMemory();
    this.maintainCreepMemory();
  }
  private maintainQueueMemory() {
    new QueueMemoryController();
  }
  private maintainPathMemory() {
    new PathFinderMemoryController();
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
    let roomsToAddToMemory: string[] = roomOperations.generateRoomsArray();
    roomsToAddToMemory = roomsToAddToMemory.concat(roomsToMonitor);
    roomsToAddToMemory.forEach(roomName => {
      new RoomMemoryController(roomName);
    });
  }
}
