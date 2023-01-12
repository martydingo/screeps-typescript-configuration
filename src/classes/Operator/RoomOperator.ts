import { profile } from "Profiler";
import { ClaimRoomJob } from "classes/Job/ClaimRoomJob";
import { ReserveRoomJob } from "classes/Job/ReserveRoomJob";
import { ScoutRoomJob } from "classes/Job/ScoutRoomJob";
import { findPath } from "common/findPath";
import { myScreepsUsername } from "configuration/user";
import { roomOperations } from "common/roomOperations";
import { TankRoomJob } from "classes/Job/TankRoomJob";
import { roomsToTank } from "configuration/rooms/roomsToTank";
import { DefendRoomJob } from "classes/Job/DefendRoomJob";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { roomsToDismantleEnemyBuildings } from "configuration/rooms/roomsToDismantleEnemyBuildings";
import { DismantleEnemyBuildingsJob } from "classes/Job/DismantleEnemyBuildingsJob";

@profile
export class RoomOperator {
  public constructor() {
    this.maintainTankRoomJobs();
    this.maintainDismantleEnemyBuildingsJobs();
    const roomsToOperate: string[] = roomOperations.generateRoomsArray();
    roomsToOperate.forEach(roomName => {
      this.maintainDefendRoomJobs(roomName);
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
                if (room.controller?.upgradeBlocked) {
                  if (room.controller?.upgradeBlocked < 150) {
                    this.createReserveRoomJob(roomName);
                  }
                } else {
                  this.createReserveRoomJob(roomName);
                }
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
  private maintainTankRoomJobs(): void {
    roomsToTank.forEach(roomName => {
      const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
      const jobParameters: TankRoomJobParameters = {
        jobType: "tankRoom",
        status: "movingIntoRoom",
        room: roomName,
        spawnRoom
      };
      new TankRoomJob(jobParameters, creepNumbers[jobParameters.jobType]);
    });
    Object.entries(Memory.queues.jobQueue)
      .filter(([, jobQueueEntry]) => jobQueueEntry.jobType === "tankRoom")
      .forEach(([jobQueueUUID, jobQueueEntry]) => {
        if (!roomsToTank.includes(jobQueueEntry.room)) {
          delete Memory.queues.jobQueue[jobQueueUUID];
        }
      });
  }
  private maintainDismantleEnemyBuildingsJobs(): void {
    roomsToDismantleEnemyBuildings.forEach(roomName => {
      const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
      const jobParameters: DismantleEnemyBuildingsJobParameters = {
        jobType: "dismantleEnemyBuildings",
        status: "movingIntoRoom",
        room: roomName,
        spawnRoom
      };
      new DismantleEnemyBuildingsJob(jobParameters, creepNumbers[jobParameters.jobType]);
    });
    Object.entries(Memory.queues.jobQueue)
      .filter(([, jobQueueEntry]) => jobQueueEntry.jobType === "dismantleEnemyBuildings")
      .forEach(([jobQueueUUID, jobQueueEntry]) => {
        if (!roomsToDismantleEnemyBuildings.includes(jobQueueEntry.room)) {
          delete Memory.queues.jobQueue[jobQueueUUID];
        }
      });
  }
  private maintainDefendRoomJobs(roomName: string): void {
    if (Memory.rooms[roomName]) {
      const roomHostileCount = Object.entries(Memory.rooms[roomName].monitoring.hostiles);
      if (roomHostileCount.length > 0) {
        const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
        const jobParameters: DefendRoomJobParameters = {
          jobType: "defendRoom",
          status: "movingIntoRoom",
          room: roomName,
          spawnRoom
        };
        new DefendRoomJob(jobParameters);
      } else {
        Object.entries(Memory.queues.jobQueue)
          .filter(([, jobQueueEntry]) => jobQueueEntry.jobType === "defendRoom" && jobQueueEntry.room === roomName)
          .forEach(([jobQueueUUID]) => {
            delete Memory.queues.jobQueue[jobQueueUUID];
          });
      }
    }
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
    let postponeCreate = false;
    const room = Game.rooms[roomName];
    if (room) {
      if (room.controller) {
        if (room.controller.upgradeBlocked) {
          if (room.controller.upgradeBlocked > 150) {
            postponeCreate = true;
          }
          if (room.controller.reservation) {
            if (room.controller.reservation.username === myScreepsUsername) {
              if (room.controller.reservation.ticksToEnd > 1000) {
                postponeCreate = true;
              }
            }
          }
        }
      }
    } else {
      postponeCreate = true;
    }
    const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
    const jobParameters: ReserveRoomJobParameters = {
      jobType: "reserveRoom",
      status: "movingIntoRoom",
      room: roomName,
      spawnRoom
    };
    if (!postponeCreate) {
      new ReserveRoomJob(jobParameters);
    } else {
      new ReserveRoomJob(jobParameters, 0);
    }
  }
}
