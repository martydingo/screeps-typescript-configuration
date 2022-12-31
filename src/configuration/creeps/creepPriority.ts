export function creepPriority(room: Room): { [creepType: string]: number } {
  let priority = {
    mineSource: 1,
    feedSpawn: 2,
    transportResource: 3,
    feedTower: 4,
    upgradeController: 5,
    scoutRoom: 6,
    workTerminal: 7,
    lootResource: 8,
    feedLink: 9,
    reserveRoom: 10,
    claimRoom: 11,
    buildConstructionSite: 12,
    terminalEngineer: 13,
    labEngineer: 14,
    factoryEngineer: 15
  };
  if (room) {
    let storageContainsEnergy = false;
    let roomContainsDroppedEnergy = false;
    let feederCreepAlive = false;
    if (room.memory.monitoring.structures.storage) {
      if (room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY]) {
        if (room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY].resourceAmount >= 300) {
          storageContainsEnergy = true;
        }
      }
    }
    if (Object.entries(room.memory.monitoring.droppedResources).length > 0) {
      roomContainsDroppedEnergy = true;
    }
    if (Object.entries(Memory.creeps).filter(([, creepMemory]) => creepMemory.jobType === "feedSpawn").length > 0) {
      feederCreepAlive = true;
    }
    if (roomContainsDroppedEnergy || storageContainsEnergy || feederCreepAlive) {
      priority = {
        feedSpawn: priority.mineSource,
        mineSource: priority.feedSpawn,
        transportResource: priority.transportResource,
        feedTower: priority.feedTower,
        upgradeController: priority.upgradeController,
        scoutRoom: priority.scoutRoom,
        reserveRoom: priority.reserveRoom,
        claimRoom: priority.claimRoom,
        buildConstructionSite: priority.buildConstructionSite,
        feedLink: priority.feedLink,
        workTerminal: priority.workTerminal,
        lootResource: priority.lootResource,
        terminalEngineer: priority.terminalEngineer,
        labEngineer: priority.labEngineer,
        factoryEngineer: priority.factoryEngineer
      };
    }
  }
  return priority;
}
