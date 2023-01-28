import { emptyCostMatrix } from "./costMatrixes/emptyCostMatrix";
import { standardCostMatrix } from "./costMatrixes/standardCostMatrix";

export class pathFinder {
  public constructor() {
    //
  }
  public fetchDirection(origin: RoomPosition, destination: RoomPosition, lastPathFailed = false): DirectionConstant {
    const originUUID = this.generateRoomPositionUUID(origin);
    const destinationUUID = this.generateRoomPositionUUID(destination);
    let generatePath = false;
    if (Memory.pathFinding.pathCache[destinationUUID]) {
      if (Memory.pathFinding.pathCache[destinationUUID][originUUID]) {
        //
      } else {
        generatePath = true;
      }
    } else {
      Memory.pathFinding.pathCache[destinationUUID] = {};
      generatePath = true;
    }
    if (lastPathFailed) {
      generatePath = true;
    }
    if (generatePath) {
      const directionArray: DirectionConstant[] = [];
      const pathFinderPath = this.generatePath(origin, destination);
      console.log(origin);
      Memory.pathFinding.pathCache[destinationUUID][originUUID] = origin.getDirectionTo(pathFinderPath.path[0]);
      pathFinderPath.path.forEach((currentRoomPosition, currentRoomPositionIndex, pathArray) => {
        const nextRoomPosition = pathArray[currentRoomPositionIndex + 1];
        const directionToNextRoomPosition = currentRoomPosition.getDirectionTo(nextRoomPosition);
        directionArray.push(directionToNextRoomPosition);
        const currentRoomPositionUUID = this.generateRoomPositionUUID(currentRoomPosition);
        Memory.pathFinding.pathCache[destinationUUID][currentRoomPositionUUID] = directionToNextRoomPosition;
      });
    }
    const direction: DirectionConstant = Memory.pathFinding.pathCache[destinationUUID][originUUID];

    return direction;
  }

  private generatePath(origin: RoomPosition, destination: RoomPosition, costMatrixTemplate?: string) {
    switch (costMatrixTemplate) {
      case "none":
        return PathFinder.search(origin, destination, {
          roomCallback(roomName) {
            const costMatrix = new emptyCostMatrix(roomName);
            return costMatrix.fetch();
          }
        });
      default:
        return PathFinder.search(origin, destination, {
          roomCallback(roomName) {
            const costMatrix = new standardCostMatrix(roomName);
            return costMatrix.fetch();
          }
        });
    }
  }
  private feedCache(path: any) {
    //
  }
  private generateRoomPositionUUID(roomPosition: RoomPosition): string {
    return `${roomPosition.x}${roomPosition.y}${roomPosition.roomName}`;
  }
}
