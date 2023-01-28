import { profile } from "Profiler";
import { LabEngineerJob } from "classes/Job/LabEngineerJob";
import { base64 } from "common/utilities/base64";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { labConfiguration } from "configuration/rooms/labs/labConfiguration";
import { creepNumbersOverride } from "configuration/rooms/creepNumbersOverride";

@profile
export class LabOperator {
  public constructor() {
    if (Memory.rooms) {
      Object.entries(Memory.rooms).forEach(([roomName]) => {
        Object.entries(Memory.rooms[roomName].monitoring.structures.labs).forEach(([labIdString]) => {
          const labId = labIdString as Id<StructureLab>;
          const lab = Game.getObjectById(labId);
          if (lab) {
            if (lab.my) {
              this.manageLabJobs(lab);
            }
          }
        });
        this.maintainLabEngineerJobs(roomName);
      });
    }
  }
  private manageLabJobs(lab: StructureLab) {
    if (lab.store[RESOURCE_ENERGY] < LAB_ENERGY_CAPACITY) {
      this.createFeedLabEnergyJob(lab);
    } else {
      this.destroyFeedLabEnergyJob(lab);
    }
    if (labConfiguration[lab.pos.roomName]) {
      if (lab.id === labConfiguration[lab.pos.roomName].boostLab) {
        if (lab.room.terminal) {
          if (
            lab.room.terminal?.store[RESOURCE_CATALYZED_GHODIUM_ACID] > 0 &&
            lab.store.getFreeCapacity(RESOURCE_CATALYZED_GHODIUM_ACID) > 0
          ) {
            this.createFeedLabXGH20Job(lab);
          } else {
            this.destroyFeedLabXGH20Job(lab);
          }
        }
      }
    }
  }
  private createFeedLabEnergyJob(lab: StructureLab) {
    const labJobName = "feedLabEnergy";
    const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);

    if (lab.room.memory.queues.labQueue) {
      lab.room.memory.queues.labQueue[labJobUuid] = {
        labId: lab.id,
        labJobType: "feedLabEnergy",
        priority: 1
      };
    }
  }
  private destroyFeedLabEnergyJob(lab: StructureLab) {
    const labJobName = "feedLabEnergy";
    const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);

    if (lab.room.memory.queues.labQueue) {
      if (lab.room.memory.queues.labQueue[labJobUuid]) {
        delete lab.room.memory.queues.labQueue[labJobUuid];
      }
    }
  }
  private createFeedLabXGH20Job(lab: StructureLab) {
    const labJobName = "feedLabXGH20";
    const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);

    if (lab.room.memory.queues.labQueue) {
      lab.room.memory.queues.labQueue[labJobUuid] = {
        labId: lab.id,
        labJobType: "feedLabXGH20",
        priority: 2
      };
    }
  }
  private destroyFeedLabXGH20Job(lab: StructureLab) {
    const labJobName = "feedLabXGH20";
    const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);

    if (lab.room.memory.queues.labQueue) {
      if (lab.room.memory.queues.labQueue[labJobUuid]) {
        delete lab.room.memory.queues.labQueue[labJobUuid];
      }
    }
  }
  private maintainLabEngineerJobs(roomName: string) {
    if (Object.entries(Memory.rooms[roomName].monitoring.structures.labs).length > 0) {
      const jobParameters: LabEngineerJobParameters = {
        room: roomName,
        status: "awaitingJob",
        jobType: "labEngineer"
      };
      let count: number = creepNumbers[jobParameters.jobType];
      if (creepNumbersOverride[jobParameters.room]) {
        if (creepNumbersOverride[jobParameters.room][jobParameters.jobType]) {
          count = creepNumbers[jobParameters.jobType] + creepNumbersOverride[jobParameters.room][jobParameters.jobType];
        }
      }
      const labJobs = Object.entries(Memory.rooms[roomName].queues.labQueue);
      if (labJobs.length === 0) {
        count = 0;
      }

      new LabEngineerJob(jobParameters, count);
    }
  }
}
