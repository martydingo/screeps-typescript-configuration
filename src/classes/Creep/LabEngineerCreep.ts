import { profile } from "Profiler";
import { BaseCreep } from "classes/BaseCreep";
import { Log } from "classes/Log";

@profile
export class LabEngineerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    if (creep.memory.status === "awaitingJob") {
      if (Object.entries(creep.room.memory.queues.labQueue).length > 0) {
        this.assignLabJob(creep);
      } else {
        this.deassignLabJob(creep);
      }
    }
    if (creep.memory.status !== "awaitingJob") {
      if (creep.memory.labJobUUID) {
        const nextJobParameters = creep.room.memory.queues.labQueue[creep.memory.labJobUUID];
        if (nextJobParameters) {
          // Mux LabJobs
          switch (nextJobParameters.labJobType) {
            case "feedLabEnergy":
              this.runFeedLabEnergyJob(creep);
              break;
            case "feedLabXGH20":
              this.runFeedLabXGH20Job(creep);
              break;
            default:
              Log.Alert(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `LabEngineer ${creep.name} in room ${creep.room.name} cannot understand the labJobType: ${nextJobParameters.labJobType}`
              );
              break;
          }
        } else {
          this.deassignLabJob(creep);
        }
      }
    }
  }
  private assignLabJob(creep: Creep) {
    const labJobs = Object.entries(creep.room.memory.queues.labQueue);
    const nextLabJobUUID = labJobs.sort(
      ([, labJobMemoryA], [, labJobMemoryB]) => labJobMemoryA.priority - labJobMemoryB.priority
    )[0][0];
    creep.memory.labJobUUID = nextLabJobUUID;
    creep.memory.status = "working";
  }
  private deassignLabJob(creep: Creep) {
    delete creep.memory.labJobUUID;
    creep.memory.status = "awaitingJob";
  }
  private runFeedLabEnergyJob(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      this.fetchSource(creep, true);
    } else if (creep.memory.status === "working") {
      if (creep.memory.labJobUUID) {
        const lab = Game.getObjectById(creep.room.memory.queues.labQueue[creep.memory.labJobUUID].labId);
        if (lab) {
          this.depositResource(creep, lab, RESOURCE_ENERGY);
        }
      }
    }
  }
  private runFeedLabXGH20Job(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_CATALYZED_GHODIUM_ACID);
    if (creep.memory.status === "fetchingResource") {
      if (creep.room.terminal) {
        this.withdrawResource(creep, creep.room.terminal, RESOURCE_CATALYZED_GHODIUM_ACID);
      }
    } else if (creep.memory.status === "working") {
      if (creep.memory.labJobUUID) {
        const lab = Game.getObjectById(creep.room.memory.queues.labQueue[creep.memory.labJobUUID].labId);
        if (lab) {
          this.depositResource(creep, lab, RESOURCE_CATALYZED_GHODIUM_ACID);
        }
      }
    }
  }
}
