/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FeedLinkJob } from "classes/Job/FeedLinkJob";
import { Log } from "classes/Log";
import { creepNumbers } from "configuration/creeps/creepNumbers";
import { linkConfig } from "configuration/rooms/links/linkConfig";

export class LinkOperator {
  public constructor() {
    this.operateLinks();
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
  private operateLinks(): void {
    Object.entries(Game.rooms).forEach(([roomName]) => {
      if (Memory.rooms[roomName].monitoring.structures.links) {
        Object.entries(Memory.rooms[roomName].monitoring.structures.links).forEach(([linkIdString]) => {
          const linkId = linkIdString as Id<StructureLink>;
          const link = Game.getObjectById(linkId);
          if (link) {
            if (!Memory.rooms[roomName].monitoring.structures.links[linkId].mode) {
              this.setLinkMode(link);
            }
            const linkMode = Memory.rooms[roomName].monitoring.structures.links[linkId].mode;
            if (linkMode === "tx") {
              this.createLinkFeederJob(link);
              this.transmitEnergy(link);
            }
          }
        });
        Object.entries(Memory.rooms[roomName].monitoring.structures.links).forEach(([linkIdString]) => {
          const linkId = linkIdString as Id<StructureLink>;
          const link = Game.getObjectById(linkId);
          const linkMode = Memory.rooms[roomName].monitoring.structures.links[linkId].mode;
          if (linkMode === "tx" && link) {
            this.createLinkFeederJob(link);
            this.transmitEnergy(link);
          }
        });
      }
    });
  }
  private transmitEnergy(txLink: StructureLink) {
    if (txLink.store[RESOURCE_ENERGY] === txLink.store.getCapacity(RESOURCE_ENERGY)) {
      if (txLink.cooldown === 0) {
        const linkIdsThatCanRecieveEnergy = Object.entries(
          Memory.rooms[txLink.pos.roomName].monitoring.structures.links
        )
          .filter(
            ([, linkMonitorMemory]) =>
              linkMonitorMemory.mode === "rx" &&
              linkMonitorMemory.energy.energyAvailable < linkMonitorMemory.energy.energyCapacity
          )
          .sort(
            ([, linkMonitorMemoryA], [, linkMonitorMemoryB]) =>
              linkMonitorMemoryA.energy.energyAvailable - linkMonitorMemoryB.energy.energyAvailable
          );

        if (linkIdsThatCanRecieveEnergy.length > 0) {
          const destinationLinkId = linkIdsThatCanRecieveEnergy[0][0] as Id<StructureLink>;
          const destinationLink = Game.getObjectById(destinationLinkId);
          if (destinationLink) {
            const transmissionResult = txLink.transferEnergy(destinationLink);
            Log.Debug(
              `${txLink.id} attempted to transmit energy to ${destinationLink.id}, result: ${transmissionResult} `
            );
          }
        }
      }
    }
  }
  private createLinkFeederJob(link: StructureLink) {
    const jobParameters: FeedLinkJobParameters = {
      status: "fetchingResource",
      room: link.room.name,
      jobType: "feedLink",
      linkId: link.id
    };
    const count: number = creepNumbers[jobParameters.jobType];
    new FeedLinkJob(jobParameters, count);
  }
}
