export {};
declare global {
  interface HostileMonitorMemory {
    [hostileCreepId: Id<Creep>]: {
      owner: string;
      bodyParts: BodyPartConstant[];
      health: {
        hits: number;
        hitsMax: number;
      };
    };
  }
}
