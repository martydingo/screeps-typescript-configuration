export {};
declare global {
  interface PathfinderMemory {
    pathCache: {
      [destination: string]: {
        [origin: string]: DirectionConstant;
      };
    };
  }
}
