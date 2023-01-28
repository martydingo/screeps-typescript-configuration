import { roomsToAvoid } from "configuration/rooms/roomsToAvoid";
import { myScreepsUsername } from "configuration/user";

export const findPath = {
  findClearTerrain(roomName: string): RoomPosition {
    if (Game.rooms[roomName]) {
      const roomTerrainMatrix = Game.rooms[roomName].getTerrain();
      for (let x = 15; x < 35; x++) {
        for (let y = 15; y < 35; y++) {
          if (roomTerrainMatrix.get(x, y) === 0) {
            return new RoomPosition(x, y, roomName);
          }
        }
      }
    }
    return new RoomPosition(25, 25, roomName);
  },
  findClosestSpawnToRoom(roomName: string) {
    const spawnDistanceMatrix: { [key: string]: number } = {};
    Object.entries(Game.spawns)
      .filter(([, spawn]) => spawn.isActive())
      .forEach(([spawnName, spawn]) => {
        const routeToSpawn = Game.map.findRoute(spawn.pos.roomName, roomName);

        spawnDistanceMatrix[spawnName] = Object.entries(routeToSpawn).length;
      });
    const spawnName = Object.entries(spawnDistanceMatrix).sort(
      ([spawnNameA], [spawnNameB]) => spawnDistanceMatrix[spawnNameA] - spawnDistanceMatrix[spawnNameB]
    )[0][0];

    return Game.spawns[spawnName];
  },
  findClosestStorageToRoom(originRoomName: string) {
    const storageDistanceMatrix: { [key: string]: number } = {};
    Object.entries(Game.rooms).forEach(([roomName, room]) => {
      if (room.storage && room.storage.my) {
        const routeToStorage = Game.map.findRoute(originRoomName, roomName);
        storageDistanceMatrix[roomName] = Object.entries(routeToStorage).length;
      }
    });
    const storageRoom = Object.entries(storageDistanceMatrix).sort(
      ([storageRoomA], [storageRoomB]) => storageDistanceMatrix[storageRoomA] - storageDistanceMatrix[storageRoomB]
    )[0][0];

    return Game.rooms[storageRoom].storage;
  },
  findSafePathToRoom(originRoomName: string, destinationRoomName: string) {
    const safeRoute = Game.map.findRoute(originRoomName, destinationRoomName, {
      routeCallback(nextRoom): number {
        let roomMonitored = false;
        if (nextRoom === "W55N11") {
          return 1;
        }
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
