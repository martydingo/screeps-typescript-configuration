export {};
declare global {
  interface TerminalEngineerJobParameters {
    uuid?: string;
    room: string;
    spawnRoom?: string;
    status: string;
    jobType: "terminalEngineer";
    terminalId: Id<StructureTerminal>;
  }
}
