export {};

declare global {
  interface SourceMonitorMemory {
    [SourceID: Id<Source>]: {
      totalEnergy: number;
      remainingEnergy: number;
    };
  }
}
