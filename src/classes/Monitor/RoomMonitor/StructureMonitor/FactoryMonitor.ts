export class FactoryMonitor {
  public constructor(factory: StructureFactory) {
    this.monitorFactory(factory);
  }
  private monitorFactory(factory: StructureFactory): void {
    if (factory) {
      const factoryStorage: { [resourceName: string]: { amount: number } } = {};
      Object.entries(factory.store).forEach(([resourceName]) => {
        const resourceNameTyped = resourceName as ResourceConstant;
        factoryStorage[resourceName] = { amount: factory.store[resourceNameTyped] };
      });
      factory.room.memory.monitoring.structures.factory = {
        resources: factoryStorage,
        structure: {
          hits: factory.hits,
          hitsMax: factory.hitsMax
        },
        cooldown: factory.cooldown,
        id: factory.id
      };
    }
  }
}
