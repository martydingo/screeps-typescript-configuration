export {};
declare global {
  interface EnergyMonitorMemory {
    history: {
      [monitorTime: number]: {
        energyAvailable: number;
        energyCapacity: number;
      };
    };
    maximumEnergyAvailable?: number;
    minimumEnergyAvailable?: number;
    averageEnergyAvailable?: number;
  }
}
