import { roomsToClaim } from "configuration/rooms/roomsToClaim";
import { roomsToMine } from "configuration/rooms/roomsToMine";

export const roomOperations = {
  generateRoomsArray(roomOperation?: string): string[] {
    let roomsArray: string[] = [];
    if (roomOperation) {
      if (roomOperation === "mine") {
        roomsArray = roomsToMine;
      } else {
        if (roomOperation === "claim") {
          roomsArray = roomsToClaim;
        }
      }
    } else {
      roomsArray = roomsArray.concat(roomsToMine);
      roomsArray = roomsArray.concat(roomsToClaim);
      Object.entries(Game.rooms).forEach(([roomName, room]) => {
        let monitorRoom = false;
        if (room) {
          if (room.controller) {
            if (room.controller.my) {
              monitorRoom = true;
            }
            if (!room.controller.owner) {
              monitorRoom = true;
            }
          }
        }
        if (monitorRoom === true) {
          roomsArray.push(roomName);
        }
      });
    }
    return roomsArray;
  }
};
