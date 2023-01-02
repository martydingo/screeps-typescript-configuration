/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export class RoomMemoryController {
  private roomMemorySchematic;
  private roomName;
  public constructor(roomName: string) {
    const roomMemorySchematic = {
      monitoring: {
        constructionSites: {},
        droppedResources: {},
        energy: {
          history: {}
        },
        hostiles: {},
        sources: {},
        minerals: {},
        structures: {
          spawns: {},
          extensions: {},
          extractors: {},
          roads: {},
          towers: {},
          links: {},
          containers: {},
          labs: {},
          walls: {},
          other: {}
        }
      },
      queues: {
        spawnQueue: {},
        terminalQueue: {},
        labQueue: {},
        factoryQueue: {}
      }
    };
    this.roomMemorySchematic = roomMemorySchematic;
    this.roomName = roomName;
    this.maintainRoomMemoryHealth();
  }

  private maintainRoomMemoryHealth(pastKey?: string[], memoryDictionary?: unknown) {
    if (!memoryDictionary) {
      if (!Memory.rooms[this.roomName]) {
        Memory.rooms[this.roomName] = this.roomMemorySchematic;
      }
      Object.entries(this.roomMemorySchematic).forEach(([key, value]) => {
        if (!Memory.rooms[this.roomName][key]) {
          Memory.rooms[this.roomName][key] = value;
        } else {
          this.maintainRoomMemoryHealth([key], value);
        }
      });
    } else {
      Object.entries(memoryDictionary).forEach(([key, value]) => {
        if (pastKey) {
          if (pastKey.length === 1) {
            if (!Memory.rooms[this.roomName][pastKey[0]][key]) {
              Memory.rooms[this.roomName][pastKey[0]][key] = value;
            } else {
              const newKey = pastKey.concat(key);
              this.maintainRoomMemoryHealth(newKey, value);
            }
          } else {
            let path = "";
            pastKey.forEach(lastKey => {
              path = `${path}['${lastKey}']`;
            });
            path = `${path}['${key}']`;
            const setMemoryCommand = `Memory.rooms['${this.roomName}']${path} = {}`;
            const memoryExistsCommand = `!(Memory.rooms['${this.roomName}']${path} === undefined)`;

            // eslint-disable-next-line no-eval
            const memoryExists: boolean = eval(memoryExistsCommand);
            if (!memoryExists) {
              // eslint-disable-next-line no-eval
              eval(setMemoryCommand);
            }
          }
        }
      });
    }
  }

  // private maintainRoomMemoryHealth(roomName: string): void {
  //   if (!Memory.rooms[roomName]) {
  //     this.initializeRoomMemory(roomName);
  //   } else {
  //     if (Memory.rooms[roomName].monitoring || !Memory.rooms[roomName].queues) {
  //       if (!Memory.queues.spawnQueue) {
  //         this.initializeSpawnRoomMemory();
  //       } else {
  //         if (!Memory.queues.jobQueue) {
  //           this.initializeJobRoomMemory();
  //         }
  //       }
  //     }
  //   }
  // }
  // private initializeRoomMemory(roomName: string): void {
  //   Memory.rooms[roomName] = {};
  // }
  // private initializeRoomMonitorMemory(roomName: string): void {
  //   Memory.rooms[roomName].monitoring = {
  //     constructionSites: {},
  //     droppedResources: {},
  //     energy: {
  //       history: {}
  //     },
  //     hostiles: {},
  //     sources: {},
  //     structures: {
  //       spawns: {},
  //       extensions: {},
  //       roads: {},
  //       towers: {},
  //       links: {},
  //       other: {}
  //     }
  //   };
  // }
}
