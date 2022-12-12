export function creepPriority(room: Room): { [creepType: string]: number } {
  let priority = {
    mineSource: 1,
    feedSpawn: 2,
    feedTower: 3,
    upgradeController: 4,
    scoutRoom: 5,
    reserveRoom: 6,
    claimRoom: 7,
    buildConstructionSite: 8
  };
  if (room) {
    let storageContainsEnergy = false;
    let roomContainsDroppedEnergy = false;
    if (room.memory.monitoring.structures.storage) {
      if (room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY]) {
        if (room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY].resourceAmount > 0) {
          storageContainsEnergy = true;
        }
      }
    }
    if (Object.entries(room.memory.monitoring.droppedResources).length > 0) {
      roomContainsDroppedEnergy = true;
    }
    if (roomContainsDroppedEnergy === true || storageContainsEnergy === true) {
      priority = {
        feedSpawn: priority.mineSource,
        mineSource: priority.feedSpawn,
        feedTower: priority.feedTower,
        upgradeController: priority.upgradeController,
        scoutRoom: priority.scoutRoom,
        reserveRoom: priority.reserveRoom,
        claimRoom: priority.claimRoom,
        buildConstructionSite: priority.buildConstructionSite
      };
    }
  }
  return priority;
}
