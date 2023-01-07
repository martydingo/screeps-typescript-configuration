import { ConstructionSiteMonitor } from "./RoomMonitor/ConstructionSiteMonitor";
import { DroppedResourceMonitor } from "./RoomMonitor/DroppedResourceMonitor";
import { EnergyMonitor } from "./RoomMonitor/EnergyMonitor";
import { HostileMonitor } from "./RoomMonitor/HostileMonitor";
import { MineralMonitor } from "./RoomMonitor/MineralMonitor";
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
      if (!this.room.controller) {
        this.runChildMonitors();
      } else {
        if (!this.room.controller.owner) {
          this.runChildMonitors();
        }
        if (this.room.controller.my) {
          this.runChildMonitors();
        }
      }
    }
  }
  private runChildMonitors(): void {
    this.runStructureMonitor();
    this.runEnergyMonitors();
    this.runHostileMonitor();
    this.runSourceMonitors();
    this.runDroppedResourceMonitors();
    this.runConstructionSiteMonitors();
    this.runMineralMonitors();
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
  private runMineralMonitors(): void {
    this.room.find(FIND_MINERALS).forEach(mineral => {
      new MineralMonitor(mineral.id);
    });
  }
  private runDroppedResourceMonitors(): void {
    new DroppedResourceMonitor(this.room);
  }
  private runConstructionSiteMonitors(): void {
    new ConstructionSiteMonitor(this.room);
  }
}
