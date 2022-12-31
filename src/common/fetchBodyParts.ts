import { Log } from "classes/Log";
import { creepBodyParts } from "configuration/creeps/creepBodyParts";

export function fetchBodyParts(creepType: string, roomName: string): BodyPartConstant[] {
  if (Game.rooms[roomName]) {
    const room: Room = Game.rooms[roomName];
    const energyAvailableHistory: number[] = [];
    Object.entries(Memory.rooms[roomName].monitoring.energy.history).forEach(([monitorTimeString]) => {
      const monitorTimeUnknown = monitorTimeString as unknown;
      const monitorTime = monitorTimeUnknown as number;
      energyAvailableHistory.push(Memory.rooms[roomName].monitoring.energy.history[monitorTime].energyAvailable);
    });
    const highestObservedEnergyAvailable = Math.max(...energyAvailableHistory);
    const lowestObservedEnergyAvailable = Math.min(...energyAvailableHistory);
    const avgObservedEnergyAvailable =
      energyAvailableHistory.reduce((runningTotal, currentNumber) => {
        return runningTotal + currentNumber;
      }, 0) / energyAvailableHistory.length;
    Memory.rooms[roomName].monitoring.energy.maximumEnergyAvailable = highestObservedEnergyAvailable;
    Memory.rooms[roomName].monitoring.energy.minimumEnergyAvailable = lowestObservedEnergyAvailable;
    Memory.rooms[roomName].monitoring.energy.averageEnergyAvailable = avgObservedEnergyAvailable;
    // Log.Debug(`Lowest observed energy in room ${roomName}: ${lowestObservedEnergyAvailable}`);
    // Log.Debug(`Highest observed energy in room ${roomName}: ${highestObservedEnergyAvailable}`);

    // RCL 1 START
    if (room.energyCapacityAvailable < 550) {
      // Return RCL1 Creep if energyCapacityAvailable is under 550
      return creepBodyParts[1][creepType];
    } else {
      // RCL 2 START
      if (room.energyCapacityAvailable >= 550 && room.energyCapacityAvailable < 800) {
        if (highestObservedEnergyAvailable >= 550) {
          // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
          return creepBodyParts[2][creepType];
        } else {
          // Return RCL1 Creep otherwise
          return creepBodyParts[1][creepType];
        }
      } else {
        // RCL 3 START
        if (room.energyCapacityAvailable >= 800 && room.energyCapacityAvailable < 1300) {
          if (highestObservedEnergyAvailable >= 800) {
            // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
            return creepBodyParts[3][creepType];
          } else if (highestObservedEnergyAvailable >= 550) {
            // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
            return creepBodyParts[2][creepType];
          } else {
            // Return RCL1 Creep iotherwise
            return creepBodyParts[1][creepType];
          }
        } else {
          // RCL 4 START
          if (room.energyCapacityAvailable >= 1300 && room.energyCapacityAvailable < 1800) {
            if (highestObservedEnergyAvailable >= 1300) {
              // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
              return creepBodyParts[4][creepType];
            } else if (highestObservedEnergyAvailable >= 800) {
              // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
              return creepBodyParts[3][creepType];
            } else if (highestObservedEnergyAvailable >= 550) {
              // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
              return creepBodyParts[2][creepType];
            } else {
              // Return RCL1 Creep otherwise
              return creepBodyParts[1][creepType];
            }
          } else {
            // RCL 5 START
            if (room.energyCapacityAvailable >= 1800 && room.energyCapacityAvailable < 2300) {
              if (highestObservedEnergyAvailable >= 1800) {
                // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                return creepBodyParts[5][creepType];
              } else if (highestObservedEnergyAvailable >= 1300) {
                // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                return creepBodyParts[4][creepType];
              } else if (highestObservedEnergyAvailable >= 800) {
                // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                return creepBodyParts[3][creepType];
              } else if (highestObservedEnergyAvailable >= 550) {
                // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                return creepBodyParts[2][creepType];
              } else {
                // Return RCL1 Creep otherwise
                return creepBodyParts[1][creepType];
              }
            } else {
              // RCL 6 START
              if (room.energyCapacityAvailable >= 2300 && room.energyCapacityAvailable < 5600) {
                if (highestObservedEnergyAvailable >= 2300) {
                  // Return RCL6 Creep if highestObservedEnergyAvailable is above 2300
                  return creepBodyParts[6][creepType];
                } else if (highestObservedEnergyAvailable >= 1800) {
                  // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                  return creepBodyParts[5][creepType];
                } else if (highestObservedEnergyAvailable >= 1300) {
                  // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                  return creepBodyParts[4][creepType];
                } else if (highestObservedEnergyAvailable >= 800) {
                  // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                  return creepBodyParts[3][creepType];
                } else if (highestObservedEnergyAvailable >= 550) {
                  // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                  return creepBodyParts[2][creepType];
                } else {
                  // Return RCL1 Creep otherwise
                  return creepBodyParts[1][creepType];
                }
              } else {
                // RCL 7 START
                if (room.energyCapacityAvailable >= 5600 && room.energyCapacityAvailable < 12900) {
                  if (highestObservedEnergyAvailable >= 5600) {
                    // Return RCL7 Creep if highestObservedEnergyAvailable is above 5600
                    return creepBodyParts[7][creepType];
                  } else if (highestObservedEnergyAvailable >= 2300) {
                    // Return RCL6 Creep if highestObservedEnergyAvailable is above 2300
                    return creepBodyParts[6][creepType];
                  } else if (highestObservedEnergyAvailable >= 1800) {
                    // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                    return creepBodyParts[5][creepType];
                  } else if (highestObservedEnergyAvailable >= 1300) {
                    // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                    return creepBodyParts[4][creepType];
                  } else if (highestObservedEnergyAvailable >= 800) {
                    // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                    return creepBodyParts[3][creepType];
                  } else if (highestObservedEnergyAvailable >= 550) {
                    // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                    return creepBodyParts[2][creepType];
                  } else {
                    // Return RCL1 Creep otherwise
                    return creepBodyParts[1][creepType];
                  }
                } else {
                  // RCL 8 START
                  if (room.energyCapacityAvailable >= 12900) {
                    if (highestObservedEnergyAvailable >= 12900) {
                      // Return RCL8 Creep if highestObservedEnergyAvailable is above 12900
                      return creepBodyParts[8][creepType];
                    } else if (highestObservedEnergyAvailable >= 5600) {
                      // Return RCL7 Creep if highestObservedEnergyAvailable is above 5600
                      return creepBodyParts[7][creepType];
                    } else if (highestObservedEnergyAvailable >= 2300) {
                      // Return RCL6 Creep if highestObservedEnergyAvailable is above 2300
                      return creepBodyParts[6][creepType];
                    } else if (highestObservedEnergyAvailable >= 1800) {
                      // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                      return creepBodyParts[5][creepType];
                    } else if (highestObservedEnergyAvailable >= 1300) {
                      // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                      return creepBodyParts[4][creepType];
                    } else if (highestObservedEnergyAvailable >= 800) {
                      // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                      return creepBodyParts[3][creepType];
                    } else if (highestObservedEnergyAvailable >= 550) {
                      // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                      return creepBodyParts[2][creepType];
                    } else {
                      // Return RCL1 Creep otherwise
                      return creepBodyParts[1][creepType];
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return [];
}
