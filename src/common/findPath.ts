import { roomsToAvoid } from "configuration/rooms/roomsToAvoid";
import { myScreepsUsername } from "configuration/user";

export const findPath = {
  findClearTerrain(roomName: string): RoomPosition {
    const roomTerrainMatrix = Game.rooms[roomName].getTerrain();
    for (let x = 2; x < 50; x++) {
      for (let y = 2; y < 50; y++) {
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
