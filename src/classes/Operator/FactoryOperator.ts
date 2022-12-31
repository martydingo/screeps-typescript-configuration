import { FactoryEngineerJob } from "classes/Job/FactoryEngineerJob";
import { base64 } from "common/utilities/base64";
import { creepNumbers } from "configuration/creeps/creepNumbers";

export class FactoryOperator {
  public constructor() {
    if (Memory.rooms) {
      Object.entries(Memory.rooms).forEach(([roomName]) => {
        if (Memory.rooms[roomName]) {
          const factoryMemory = Memory.rooms[roomName].monitoring.structures.factory;
          if (factoryMemory) {
            const factory = Game.getObjectById(factoryMemory.id);
            if (factory) {
              this.manageFactoryJobs(factory);
              this.maintainFactoryEngineerJobs(factory);
            }
          }
        }
      });
    }
  }
  private manageFactoryJobs(factory: StructureFactory) {
    if (factory.store[RESOURCE_ENERGY] < FACTORY_CAPACITY / 10 && factory.store.getCapacity(RESOURCE_ENERGY) > 0) {
      this.createFeedFactoryEnergyJob(factory);
    } else {
      this.destroyFeedFactoryEnergyJob(factory);
    }
  }
  private createFeedFactoryEnergyJob(factory: StructureFactory) {
    const factoryJobName = "feedFactoryEnergy";
    const factoryJobUuid = base64.encode(`${factory.id}-${factoryJobName}`);

    if (factory.room.memory.queues.factoryQueue) {
      factory.room.memory.queues.factoryQueue[factoryJobUuid] = {
        factoryJobType: "feedFactoryEnergy",
        priority: 1
      };
    }
  }
  private destroyFeedFactoryEnergyJob(factory: StructureFactory) {
    const factoryJobName = "feedFactoryEnergy";
    const factoryJobUuid = base64.encode(`${factory.id}-${factoryJobName}`);

    if (factory.room.memory.queues.factoryQueue) {
      if (factory.room.memory.queues.factoryQueue[factoryJobUuid]) {
        delete factory.room.memory.queues.factoryQueue[factoryJobUuid];
      }
    }
  }
  private maintainFactoryEngineerJobs(factory: StructureFactory) {
    if (factory) {
      const jobParameters: FactoryEngineerJobParameters = {
        room: factory.pos.roomName,
        status: "awaitingJob",
        jobType: "factoryEngineer",
        factoryId: factory.id
      };
      let count = creepNumbers[jobParameters.jobType];

      const factoryJobs = Object.entries(factory.room.memory.queues.factoryQueue);
      if (factoryJobs.length === 0) {
        count = 0;
      }

      new FactoryEngineerJob(jobParameters, count);
    }
  }
}
