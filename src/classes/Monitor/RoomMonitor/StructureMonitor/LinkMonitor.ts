import { linkConfig } from "configuration/rooms/links/linkConfig";

export class LinkMonitor {
  public constructor(link: StructureLink) {
    this.monitorLinks(link);
    this.initalizeLinkMonitorModes(link);
  }
  private initalizeLinkMonitorModes(link: StructureLink) {
    if (link) {
      if (!Memory.rooms[link.pos.roomName].monitoring.structures.links[link.id].mode) {
        this.setLinkMode(link);
      }
    }
  }
  private setLinkMode(link: StructureLink): void {
    const linkRoom = link.pos.roomName;
    const linkId = link.id;
    const roomLinkConfig = linkConfig[linkRoom];
    if (roomLinkConfig) {
      if (roomLinkConfig[linkId]) {
        Memory.rooms[linkRoom].monitoring.structures.links[linkId].mode = roomLinkConfig[linkId];
      }
    }
  }
  private monitorLinks(link: StructureLink): void {
    if (link.room.memory.monitoring.structures.links) {
      if (link.room.memory.monitoring.structures.links[link.id]) {
        link.room.memory.monitoring.structures.links[link.id].energy = {
          energyAvailable: link.store[RESOURCE_ENERGY],
          energyCapacity: link.store.getCapacity(RESOURCE_ENERGY)
        };
      } else {
        link.room.memory.monitoring.structures.links[link.id] = {
          energy: {
            energyAvailable: link.store[RESOURCE_ENERGY],
            energyCapacity: link.store.getCapacity(RESOURCE_ENERGY)
          }
        };
      }
    }
  }
}
