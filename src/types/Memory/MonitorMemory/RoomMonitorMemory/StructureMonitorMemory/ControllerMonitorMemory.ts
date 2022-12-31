export {};
declare global {
  interface ControllerMonitorMemory {
    id: Id<StructureController>;
    progress: number;
    nextLevel: number;
    downgrade: number;
    safeMode: boolean;
    safeModeCooldown?: number;
  }
}
