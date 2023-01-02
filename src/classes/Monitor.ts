import { roomOperations } from "common/roomOperations";
import { RoomMonitor } from "./Monitor/RoomMonitor";

export class Monitor {
  public constructor() {
    this.monitorRooms();
  }
  private monitorRooms(): void {
    const roomsToMonitor = roomOperations.generateRoomsArray();
    roomsToMonitor.forEach(roomName => {
      new RoomMonitor(roomName);
    });
  }
}
