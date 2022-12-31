export {};
declare global {
  interface TerminalMonitorMemory {
    resources: {
      [resourceName: string]: {
        amount: number;
      };
    };
    structure: {
      hits: number;
      hitsMax: number;
    };
    cooldown: number;
  }
}
