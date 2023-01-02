import { profile } from "Profiler";
@profile
export class HostileMonitor {
  public room: Room;

  public constructor(room: Room) {
    this.room = room;
    this.initalizeHostileMonitorMemory();
    this.cleanHostilesMemory();
    this.monitorHostiles();
  }
  private initalizeHostileMonitorMemory() {
    if (!this.room.memory.monitoring.hostiles) {
      this.room.memory.monitoring.hostiles = {};
    }
  }
  private cleanHostilesMemory(): void {
    Object.entries(this.room.memory.monitoring.hostiles).forEach(([hostileIdString]) => {
      const hostileId = hostileIdString as Id<Creep>;
      const hostile = Game.getObjectById(hostileId);
      if (!hostile) {
        delete this.room.memory.monitoring.hostiles[hostileId];
      }
    });
  }
  private monitorHostiles(): void {
    const hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);
    hostileCreeps.forEach(hostileCreep => {
      const hostileBodyParts: BodyPartConstant[] = [];
      hostileCreep.body.forEach(bodyPartArray => {
        hostileBodyParts.push(bodyPartArray.type);
      });
      this.room.memory.monitoring.hostiles[hostileCreep.id] = {
        owner: hostileCreep.owner.username,
        bodyParts: hostileBodyParts,
        health: {
          hits: hostileCreep.hits,
          hitsMax: hostileCreep.hitsMax
        }
      };
    });
  }
}
