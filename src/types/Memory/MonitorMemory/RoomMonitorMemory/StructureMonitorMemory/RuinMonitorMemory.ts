export {};
declare global {
  interface RuinMonitorMemory {
    [ruineId: Id<Ruin>]: {
      resources: {
        [resourceName: string]: {
          amount: number;
        };
      };
      remainingTime: number;
    };
  }
}
