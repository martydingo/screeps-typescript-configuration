export {};

declare global {
  interface DroppedResourceMonitorMemory {
    [DroppedResourceId: string]: {
      resourceType: ResourceConstant;
      amount: number;
    };
  }
}
