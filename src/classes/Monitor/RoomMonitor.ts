import { ConstructionSiteMonitor } from "./RoomMonitor/ConstructionSiteMonitor";
import { DroppedResourceMonitor } from "./RoomMonitor/DroppedResourceMonitor";
import { EnergyMonitor } from "./RoomMonitor/EnergyMonitor";
import { HostileMonitor } from "./RoomMonitor/HostileMonitor";
import { SourceMonitor } from "./RoomMonitor/SourceMonitor";
import { StructureMonitor } from "./RoomMonitor/StructureMonitor";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RoomMonitor extends SourceMonitor {}

export class RoomMonitor {
  public roomName: string;
  public room: Room;

  public constructor(RoomName: string) {
    this.roomName = RoomName;
    this.room = Game.rooms[RoomName];
    if (this.room) {
      this.runChildMonitors();
    }
  }
  private setupRoomMemory(): void {
    if (!Memory.rooms) {
      Memory.rooms = {};
    }
    if (!Memory.rooms[this.roomName]) {
      Memory.rooms[this.roomName] = {
        monitoring: {
          constructionSites: {},
          droppedResources: {},
          energy: {
            history: {}
          },
          hostiles: {},
          sources: {},
          structures: {
            spawns: {},
            extensions: {},
            roads: {},
            towers: {},
            links: {},
            other: {}
          }
        },
        queues: {
          spawnQueue: {}
        }
      };
    } else if (!Memory.rooms[this.roomName].monitoring) {
      Memory.rooms[this.roomName].monitoring = {
        constructionSites: {},
        droppedResources: {},
        energy: {
          history: {}
        },
        hostiles: {},
        sources: {},
        structures: {
          spawns: {},
          extensions: {},
          roads: {},
          towers: {},
          links: {},
          other: {}
        }
      };
    }
  }
  private runChildMonitors(): void {
    this.runStructureMonitor();
    this.runEnergyMonitors();
    this.runHostileMonitor();
    this.runSourceMonitors();
    this.runDroppedResourceMonitors();
    this.runConstructionSiteMonitors();
  }
  private runStructureMonitor(): void {
    if (this.room.controller) {
      new StructureMonitor(this.room);
    }
  }
  private runEnergyMonitors(): void {
    new EnergyMonitor(this.room);
  }
  private runHostileMonitor(): void {
    new HostileMonitor(this.room);
  }
  private runSourceMonitors(): void {
    this.room.find(FIND_SOURCES).forEach(source => {
      new SourceMonitor(source.id);
    });
  }
  private runDroppedResourceMonitors(): void {
    new DroppedResourceMonitor(this.room);
  }
  private runConstructionSiteMonitors(): void {
    new ConstructionSiteMonitor(this.room);
  }
}
