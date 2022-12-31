export {};
declare global {
  interface ConstructionSiteMonitorMemory {
    [id: Id<ConstructionSite>]: {
      progress: number;
      total: number;
    };
  }
}
