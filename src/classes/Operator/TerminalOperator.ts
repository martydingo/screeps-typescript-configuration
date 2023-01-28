import { profile } from "Profiler";
import { TerminalEngineerJob } from "classes/Job/TerminalEngineerJob";
import { base64 } from "common/utilities/base64";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { creepNumbersOverride } from "configuration/rooms/creepNumbersOverride";

@profile
export class TerminalOperator {
  public constructor() {
    if (Memory.rooms) {
      Object.entries(Memory.rooms).forEach(([roomName]) => {
        const room = Game.rooms[roomName];
        if (room) {
          if (room.terminal) {
            if (room.terminal.my) {
              this.manageTerminalJobs(room.terminal);
              this.maintainTerminalEngineerJobs(room.terminal);
            }
          }
        }
      });
    }
  }
  private manageTerminalJobs(terminal: StructureTerminal) {
    if (terminal.store[RESOURCE_ENERGY] < TERMINAL_CAPACITY / 3 && terminal.store.getCapacity(RESOURCE_ENERGY) > 0) {
      this.createFeedTerminalEnergyJob(terminal);
    } else {
      this.destroyFeedTerminalEnergyJob(terminal);
    }
  }
  private createFeedTerminalEnergyJob(terminal: StructureTerminal) {
    const terminalJobName = "feedTerminalEnergy";
    const terminalJobUuid = base64.encode(`${terminal.id}-${terminalJobName}`);

    if (terminal.room.memory.queues.terminalQueue) {
      terminal.room.memory.queues.terminalQueue[terminalJobUuid] = {
        terminalJobType: "feedTerminalEnergy",
        priority: 1
      };
    }
  }
  private destroyFeedTerminalEnergyJob(terminal: StructureTerminal) {
    const terminalJobName = "feedTerminalEnergy";
    const terminalJobUuid = base64.encode(`${terminal.id}-${terminalJobName}`);

    if (terminal.room.memory.queues.terminalQueue) {
      if (terminal.room.memory.queues.terminalQueue[terminalJobUuid]) {
        delete terminal.room.memory.queues.terminalQueue[terminalJobUuid];
      }
    }
  }
  private maintainTerminalEngineerJobs(terminal: StructureTerminal) {
    if (terminal) {
      const jobParameters: TerminalEngineerJobParameters = {
        room: terminal.pos.roomName,
        status: "awaitingJob",
        jobType: "terminalEngineer",
        terminalId: terminal.id
      };
      let count: number = creepNumbers[jobParameters.jobType];
      if (creepNumbersOverride[jobParameters.room]) {
        if (creepNumbersOverride[jobParameters.room][jobParameters.jobType]) {
          count = creepNumbers[jobParameters.jobType] + creepNumbersOverride[jobParameters.room][jobParameters.jobType];
        }
      }
      const terminalJobs = Object.entries(terminal.room.memory.queues.terminalQueue);
      if (terminalJobs.length === 0) {
        count = 0;
      }

      new TerminalEngineerJob(jobParameters, count);
    }
  }
}
