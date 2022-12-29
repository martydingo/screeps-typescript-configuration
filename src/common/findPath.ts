import { roomsToAvoid } from "configuration/rooms/roomsToAvoid";
import { myScreepsUsername } from "configuration/user";

export const findPath = {
  findClearTerrain(roomName: string): RoomPosition {
    const roomTerrainMatrix = Game.rooms[roomName].getTerrain();
    for (let x = 15; x < 35; x++) {
      for (let y = 15; y < 35; y++) {
        if (roomTerrainMatrix.get(x, y) === 0) {
          return new RoomPosition(x, y, roomName);
        }
      }
    }
    return new RoomPosition(25, 25, roomName);
  },
  findClosestSpawnToRoom(roomName: string) {
    const spawnDistanceMatrix: { [key: string]: number } = {};
    Object.entries(Game.spawns).forEach(([spawnName, spawn]) => {
      let cost = 0;
      Game.map.findRoute(spawn.pos.roomName, roomName, {
        routeCallback(): void {
          cost = cost + 1;
        }
      });
      spawnDistanceMatrix[spawnName] = cost;
    });
    Object.entries(spawnDistanceMatrix).sort(
      ([spawnNameA], [spawnNameB]) => spawnDistanceMatrix[spawnNameB] - spawnDistanceMatrix[spawnNameA]
    );
    const spawnName = Object.entries(spawnDistanceMatrix)[0][0];
    return Game.spawns[spawnName];
  },
  findClosestStorageToRoom(originRoomName: string) {
    const storageDistanceMatrix: { [key: string]: number } = {};
    Object.entries(Game.rooms).forEach(([roomName, room]) => {
      if (room.storage) {
        let cost = 0;
        Game.map.findRoute(originRoomName, roomName, {
          routeCallback(): void {
            cost = cost + 1;
          }
        });
        storageDistanceMatrix[roomName] = cost;
      }
    });
    Object.entries(storageDistanceMatrix).sort(
      ([storageRoomA], [storageRoomB]) => storageDistanceMatrix[storageRoomA] - storageDistanceMatrix[storageRoomB]
    );
    const storageRoom = Object.entries(storageDistanceMatrix)[0][0];

    return Game.rooms[storageRoom].storage;
  },
  findSafePathToRoom(originRoomName: string, destinationRoomName: string) {
    const safeRoute = Game.map.findRoute(originRoomName, destinationRoomName, {
      routeCallback(nextRoom): number {
        let roomMonitored = false;
        if (Game.rooms[nextRoom]) {
          if (Game.rooms[nextRoom].controller?.owner?.username === myScreepsUsername) {
            return 1;
          } else {
            return 999.999;
          }
        }
        if (roomsToAvoid.includes(nextRoom)) {
          return 999.999;
        }
        Object.entries(Memory.rooms).forEach(([roomName]) => {
          if (nextRoom === roomName) {
            roomMonitored = true;
          }
        });
        if (roomMonitored) {
          return 1;
        } else {
          return 2;
        }
      }
    });
    return safeRoute;
  }
};
