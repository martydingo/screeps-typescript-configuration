export const creepBodyParts: { [key: number]: { [key: string]: BodyPartConstant[] } } = {
  // First level of nesting, calculated by energyCapacityAvailable, grouped by their RCL maximums.
  1: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, MOVE, CARRY],
    feedSpawn: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    feedTower: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [WORK, WORK, CARRY, MOVE],
    buildConstructionSite: [WORK, WORK, CARRY, MOVE]
  },
  2: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY],
    feedSpawn: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
    buildConstructionSite: [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, MOVE]
  },
  3: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY],
    feedSpawn: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    buildConstructionSite: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
  },
  4: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
    feedSpawn: [
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ],
    feedTower: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ],
    buildConstructionSite: [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ]
  },
  5: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
    feedSpawn: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    buildConstructionSite: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ]
  },
  6: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
    feedSpawn: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    buildConstructionSite: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ]
  },
  7: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
    feedSpawn: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    buildConstructionSite: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ]
  },
  8: {
    // Second level is the jobType.
    mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
    feedSpawn: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    upgradeController: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ],
    buildConstructionSite: [
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY
    ]
  }
};