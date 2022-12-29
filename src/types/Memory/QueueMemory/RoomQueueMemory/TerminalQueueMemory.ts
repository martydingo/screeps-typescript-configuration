export {};
declare global {
  interface TerminalQueueMemory {
    [terminalJobUUID: string]: {
      terminalJobType: "feedTerminalEnergy";
      priority: number;
    };
  }
}
