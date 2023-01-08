export {};
declare global {
  interface AttackQueueMemory {
    [attackQueueUUID: string]: {
      mode: "room";
      target: string;
    };
  }
}
