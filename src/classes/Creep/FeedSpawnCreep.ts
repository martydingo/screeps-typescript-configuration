import { BaseCreep } from "classes/BaseCreep";
import { profile } from "Profiler";

@profile
export class FeedSpawnCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    this.checkIfFull(creep, RESOURCE_ENERGY);
    if (creep.memory.status === "fetchingResource") {
      this.fetchSource(creep);
    } else {
      if (creep.memory.status === "working") {
        const notFullSpawnObjectArray: (StructureSpawn | StructureExtension)[] = [];
        if (creep.room.memory.monitoring.structures.spawns) {
          Object.entries(creep.room.memory.monitoring.structures.spawns)
            .filter(
              Spawn =>
                Game.spawns[Spawn[0]].room === creep.room &&
                Game.spawns[Spawn[0]].store[RESOURCE_ENERGY] < Game.spawns[Spawn[0]].store.getCapacity(RESOURCE_ENERGY)
            )
            .forEach(([spawnName]) => {
              const spawn = Game.spawns[spawnName];
              notFullSpawnObjectArray.push(spawn);
            });
        }
        if (creep.room.memory.monitoring.structures.extensions) {
          Object.entries(creep.room.memory.monitoring.structures.extensions)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            .filter(([, ExtensionMemory]) => ExtensionMemory.energyAvailable < ExtensionMemory.energyCapacity)
            .forEach(([extensionIdString]) => {
              const extensionId = extensionIdString as Id<StructureExtension>;
              const extension = Game.getObjectById(extensionId);
              if (extension) {
                notFullSpawnObjectArray.push(extension);
              }
            });
        }
        const closestNotFullSpawnObject = creep.pos.findClosestByPath(notFullSpawnObjectArray);
        if (closestNotFullSpawnObject) {
          this.depositResource(creep, closestNotFullSpawnObject, RESOURCE_ENERGY);
        }
      }
    }
  }
}
