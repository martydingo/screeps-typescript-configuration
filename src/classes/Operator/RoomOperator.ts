import { profile } from "Profiler";
import { ClaimRoomJob } from "classes/Job/ClaimRoomJob";
import { ReserveRoomJob } from "classes/Job/ReserveRoomJob";
import { ScoutRoomJob } from "classes/Job/ScoutRoomJob";
import { findPath } from "common/findPath";
import { myScreepsUsername } from "configuration/user";
import { roomOperations } from "common/roomOperations";

@profile
export class RoomOperator {
  public constructor() {
    const roomsToOperate: string[] = roomOperations.generateRoomsArray();

    //
    roomsToOperate.forEach(roomName => {
      // console.log(`${Game.time.toString()} - ${roomName}`);
      const room = Game.rooms[roomName];
      if (room) {
        const roomController = room.controller;
        if (roomController) {
          if (roomController.my) {
            // No Room Operations Required
          } else {
            if (roomOperations.generateRoomsArray("claim").includes(roomName)) {
              this.createClaimRoomJob(roomName);
            }
            if (roomOperations.generateRoomsArray("mine").includes(roomName)) {
              if (!(room.controller?.reservation?.username === myScreepsUsername)) {
                this.createReserveRoomJob(roomName);
              }
            }
          }
        }
      } else {
        this.createScoutRoomJob(roomName);
      }
    });
  }
  private createScoutRoomJob(roomName: string): void {
    const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
    const jobParameters: ScoutRoomJobParameters = {
      jobType: "scoutRoom",
      status: "movingIntoRoom",
      room: roomName,
      spawnRoom
    };
    new ScoutRoomJob(jobParameters);
  }
  private createClaimRoomJob(roomName: string): void {
    const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
    const jobParameters: ClaimRoomJobParameters = {
      jobType: "claimRoom",
      status: "movingIntoRoom",
      room: roomName,
      spawnRoom
    };
    new ClaimRoomJob(jobParameters);
  }
  private createReserveRoomJob(roomName: string): void {
    const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
    const jobParameters: ReserveRoomJobParameters = {
      jobType: "reserveRoom",
      status: "movingIntoRoom",
      room: roomName,
      spawnRoom
    };
    new ReserveRoomJob(jobParameters);
  }
}
