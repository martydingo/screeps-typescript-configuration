import { profile } from "Profiler";
@profile
export class ConstructionSiteMonitor {
  public room: Room;

  public constructor(room: Room) {
    this.room = room;
    this.initalizeConstructionSiteMonitorMemory();
    this.monitorConstructionSites();
  }
  private initalizeConstructionSiteMonitorMemory() {
    if (!this.room.memory.monitoring.constructionSites) {
      this.room.memory.monitoring.constructionSites = {};
    }
  }
  private monitorConstructionSites(): void {
    const constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);
    constructionSites.forEach(constructionSite => {
      this.room.memory.monitoring.constructionSites[constructionSite.id] = {
        progress: constructionSite.progress,
        total: constructionSite.progressTotal
      };
    });
  }
}
