import { roomOperations } from "common/roomOperations";
import { roomsToMonitor } from "configuration/rooms/roomsToMonitor";
import { RoomMonitor } from "./Monitor/RoomMonitor";

export class Monitor {
  public constructor() {
    this.monitorRooms();
  }
  private monitorRooms(): void {
    let roomMonitorArray: string[] = roomOperations.generateRoomsArray();
    roomMonitorArray = roomMonitorArray.concat(roomsToMonitor);
    roomMonitorArray.forEach(roomName => {
      new RoomMonitor(roomName);
    });
  }
}
