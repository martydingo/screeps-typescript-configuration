export {};

declare global {
  interface MineralMonitorMemory {
    [mineralId: Id<Mineral>]: {
      remainingMineral: number;
      mineralType: MineralConstant;
    };
  }
}
