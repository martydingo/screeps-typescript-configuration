import { profile } from "Profiler";
import { LootResourceJob } from "classes/Job/LootResourceJob";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { findPath } from "common/findPath";
import { creepNumbersOverride } from "configuration/rooms/creepNumbersOverride";
import { TransportResourceJob } from "classes/Job/TransportResourceJob";
import { Log } from "classes/Log";
import { roomsToLoot } from "configuration/rooms/roomsToLoot";

@profile
export class DroppedResourceMonitor {
  private room: Room;
  public constructor(room: Room) {
    this.room = room;
    if (this.room) {
      this.initializeDroppedResourceMonitorMemory();
      this.monitorDroppedResources();
      this.cleanDroppedResources();
      if (this.room.memory.monitoring.structures.storage) {
        this.createLootResourceJob();
      } else if (roomsToLoot.includes(this.room.name)) {
        this.createTransportEnergyJob();
      }
    }
  }
  private initializeDroppedResourceMonitorMemory() {
    if (!this.room.memory.monitoring.droppedResources) {
      this.room.memory.monitoring.droppedResources = {};
    }
  }
  private monitorDroppedResources(): void {
    const droppedResources = this.room.find(FIND_DROPPED_RESOURCES);
    droppedResources.forEach(droppedResource => {
      this.room.memory.monitoring.droppedResources[droppedResource.id] = {
        resourceType: droppedResource.resourceType,
        amount: droppedResource.amount
      };
    });
  }
  private cleanDroppedResources(): void {
    Object.entries(this.room.memory.monitoring.droppedResources).forEach(([droppedResourceId]) => {
      const droppedResource = Game.getObjectById(droppedResourceId as Id<Resource<ResourceConstant>>);
      if (!droppedResource) {
        delete this.room.memory.monitoring.droppedResources[droppedResourceId as Id<Resource<ResourceConstant>>];
      }
    });
  }
  private createLootResourceJob(): void {
    if (Object.entries(this.room.memory.monitoring.droppedResources).length > 0) {
      let spawnRoom = this.room.name;
      if (Object.entries(Memory.rooms[this.room.name].monitoring.structures.spawns).length === 0) {
        spawnRoom = findPath.findClosestSpawnToRoom(this.room.name).pos.roomName;
      }
      const jobParameters: LootResourceJobParameters = {
        room: spawnRoom,
        status: "fetchingResource",
        jobType: "lootResource"
      };
      const count: number =
        creepNumbers[jobParameters.jobType] + creepNumbersOverride[jobParameters.room][jobParameters.jobType];
      new LootResourceJob(jobParameters, count);
    }
  }
  private createTransportEnergyJob() {
    const spawnRoom = findPath.findClosestSpawnToRoom(this.room.name).room;
    let storage: StructureStorage | undefined;
    if (spawnRoom) {
      if (spawnRoom.storage) storage = spawnRoom.storage;
    } else {
      const findStorageResult = findPath.findClosestStorageToRoom(this.room.name);
      if (findStorageResult) {
        storage = findStorageResult;
      }
    }
    if (storage) {
      const JobParameters: TransportResourceJobParameters = {
        status: "fetchingResource",
        spawnRoom: spawnRoom.name,
        room: this.room.name,
        jobType: "transportResource",
        resourceType: RESOURCE_ENERGY,
        storage: storage.id
      };
      let count: number = creepNumbers[JobParameters.jobType];
      if (creepNumbersOverride[JobParameters.room]) {
        if (creepNumbersOverride[JobParameters.room][JobParameters.jobType]) {
          count = creepNumbers[JobParameters.jobType] + creepNumbersOverride[JobParameters.room][JobParameters.jobType];
        }
      }
      new TransportResourceJob(JobParameters, count);
    } else {
      Log.Alert(`TransportResource Job for room ${this.room.name} cannot find any storage nearby ${this.room.name}!`);
    }
  }
}
