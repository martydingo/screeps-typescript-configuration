import { BaseCreep } from "classes/BaseCreep";
import { Log } from "classes/Log";

export class FactoryEngineerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    if (creep.memory.status === "awaitingJob") {
      if (Object.entries(creep.room.memory.queues.factoryQueue).length > 0) {
        this.assignFactoryJob(creep);
      } else {
        this.deassignFactoryJob(creep);
      }
    }
    if (creep.memory.status !== "awaitingJob") {
      if (creep.memory.factoryJobUUID) {
        const nextJobParameters = creep.room.memory.queues.factoryQueue[creep.memory.factoryJobUUID];
        if (nextJobParameters) {
          // Mux FactoryJobs
          switch (nextJobParameters.factoryJobType) {
            case "feedFactoryEnergy":
              this.runFeedFactoryEnergyJob(creep);
              break;
            default:
              Log.Alert(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `FactoryEngineer ${creep.name} in room ${creep.room.name} cannot understand the factoryJobType: ${nextJobParameters.factoryJobType}`
              );
              break;
          }
        } else {
          this.deassignFactoryJob(creep);
        }
      }
    }
  }
  private assignFactoryJob(creep: Creep) {
    const factoryJobs = Object.entries(creep.room.memory.queues.factoryQueue);
    const nextFactoryJobUUID = factoryJobs.sort(
      ([, factoryJobMemoryA], [, factoryJobMemoryB]) => factoryJobMemoryA.priority - factoryJobMemoryB.priority
    )[0][0];
    creep.memory.factoryJobUUID = nextFactoryJobUUID;
    creep.memory.status = "working";
  }
  private deassignFactoryJob(creep: Creep) {
    delete creep.memory.factoryJobUUID;
    creep.memory.status = "awaitingJob";
  }
  private runFeedFactoryEnergyJob(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      this.fetchSource(creep, true);
    } else if (creep.memory.status === "working") {
      const factoryMemory = creep.room.memory.monitoring.structures.factory;
      if (factoryMemory) {
        const factory = Game.getObjectById(factoryMemory.id);
        if (factory) {
          this.depositResource(creep, factory, RESOURCE_ENERGY);
        }
      }
    }
  }
}
