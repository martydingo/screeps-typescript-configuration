import { BaseCreep } from "classes/BaseCreep";
import { Log } from "classes/Log";

export class TerminalEngineerCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    if (creep.memory.status === "awaitingJob") {
      if (Object.entries(creep.room.memory.queues.terminalQueue).length > 0) {
        this.assignTerminalJob(creep);
      } else {
        this.deassignTerminalJob(creep);
      }
    }
    if (creep.memory.status !== "awaitingJob") {
      if (creep.memory.terminalJobUUID) {
        const nextJobParameters = creep.room.memory.queues.terminalQueue[creep.memory.terminalJobUUID];
        if (nextJobParameters) {
          // Mux TerminalJobs
          switch (nextJobParameters.terminalJobType) {
            case "feedTerminalEnergy":
              this.runFeedTerminalEnergyJob(creep);
              break;
            default:
              Log.Alert(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `TerminalEngineer ${creep.name} in room ${creep.room.name} cannot understand the terminalJobType: ${nextJobParameters.terminalJobType}`
              );
              break;
          }
        } else {
          this.deassignTerminalJob(creep);
        }
      }
    }
  }
  private assignTerminalJob(creep: Creep) {
    const terminalJobs = Object.entries(creep.room.memory.queues.terminalQueue);
    const nextTerminalJobUUID = terminalJobs.sort(
      ([, terminalJobMemoryA], [, terminalJobMemoryB]) => terminalJobMemoryA.priority - terminalJobMemoryB.priority
    )[0][0];
    creep.memory.terminalJobUUID = nextTerminalJobUUID;
    creep.memory.status = "working";
  }
  private deassignTerminalJob(creep: Creep) {
    delete creep.memory.terminalJobUUID;
    creep.memory.status = "awaitingJob";
  }
  private runFeedTerminalEnergyJob(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      this.fetchSource(creep, true);
    } else if (creep.memory.status === "working") {
      if (creep.room.terminal) {
        this.depositResource(creep, creep.room.terminal, RESOURCE_ENERGY);
      }
    }
  }
}
