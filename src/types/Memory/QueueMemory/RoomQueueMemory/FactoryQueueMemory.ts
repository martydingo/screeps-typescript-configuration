export {};
declare global {
  interface FactoryQueueMemory {
    [factoryJobUUID: string]: {
      factoryJobType: "feedFactoryEnergy";
      priority: number;
    };
  }
}
