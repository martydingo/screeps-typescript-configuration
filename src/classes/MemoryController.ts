import { QueueMemory } from "./Memory/QueueMemory";
import { RoomMemory } from "./Memory/RoomMemory";
import { roomOperations } from "common/roomOperations";

export class MemoryController {
  public constructor() {
    this.maintainMemory();
  }
  private maintainMemory() {
    this.maintainQueueMemory();
    this.maintainRoomMemory();
  }
  private maintainQueueMemory() {
    new QueueMemory();
  }
  private maintainRoomMemory() {
    if (!Memory.rooms) {
      Memory.rooms = {};
    }
    const roomsToAddToMemory = roomOperations.generateRoomsArray();
    roomsToAddToMemory.forEach(roomName => {
      new RoomMemory(roomName);
    });
  }
}
