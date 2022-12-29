export class TerminalMonitor {
  public constructor(terminal: StructureTerminal) {
    this.monitorTerminal(terminal);
  }
  private monitorTerminal(terminal: StructureTerminal): void {
    if (terminal) {
      const terminalStorage: { [resourceName: string]: { amount: number } } = {};
      Object.entries(terminal.store).forEach(([resourceName]) => {
        const resourceNameTyped = resourceName as ResourceConstant;
        terminalStorage[resourceName] = { amount: terminal.store[resourceNameTyped] };
      });
      terminal.room.memory.monitoring.structures.terminal = {
        resources: terminalStorage,
        structure: {
          hits: terminal.hits,
          hitsMax: terminal.hitsMax
        },
        cooldown: terminal.cooldown
      };
    }
  }
}
