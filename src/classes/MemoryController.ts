import { QueueMemoryController } from "./MemoryController/QueueMemoryController";
import { RoomMemoryController } from "./MemoryController/RoomMemoryController";
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
    new QueueMemoryController();
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
