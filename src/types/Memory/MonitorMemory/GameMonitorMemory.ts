export {};
declare global {
  interface GameMonitorMemory {
    cpu: {
      used: number;
      bucket: number;
    };
    memory: number;
    pixels?: number;
    money?: number;
  }
}
