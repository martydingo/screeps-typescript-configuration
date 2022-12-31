/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function fetchHostileCreep(room: Room): Creep | undefined {
  const cachedHostiles = Object.entries(room.memory.monitoring.hostiles);
  if (cachedHostiles.length === 1) {
    const hostileIdUnknown = cachedHostiles[0][0] as unknown;
    const hostileId = hostileIdUnknown as Id<Creep>;
    const hostile = Game.getObjectById(hostileId);
    if (hostile) {
      return hostile;
    }
  } else {
    if (cachedHostiles.length > 1) {
      const cachedHostilesThatHeal = cachedHostiles.filter(
        ([, cachedHostileMemory]) => cachedHostileMemory.bodyParts.includes(HEAL) === true
      );
      if (cachedHostilesThatHeal.length === 1) {
        const hostileIdUnknown = cachedHostilesThatHeal[0][0] as unknown;
        const hostileId = hostileIdUnknown as Id<Creep>;
        const hostile = Game.getObjectById(hostileId);
        if (hostile) {
          return hostile;
        }
      } else {
        if (cachedHostilesThatHeal.length > 1) {
          const cachedHostilesThatHealLowestHP = cachedHostiles.sort(
            ([, cachedHostileMemoryA], [, cachedHostileMemoryB]) =>
              cachedHostileMemoryA.health.hits - cachedHostileMemoryB.health.hits
          );
          const hostileIdUnknown = cachedHostilesThatHealLowestHP[0][0] as unknown;
          const hostileId = hostileIdUnknown as Id<Creep>;
          const hostile = Game.getObjectById(hostileId);
          if (hostile) {
            return hostile;
          }
        }
      }
    }
  }
  return undefined;
}
