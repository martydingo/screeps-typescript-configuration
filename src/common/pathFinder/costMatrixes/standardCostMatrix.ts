import { emptyCostMatrix } from "./emptyCostMatrix";

export class standardCostMatrix extends emptyCostMatrix {
  private room: Room;
  public constructor(roomName: string) {
    super(roomName);
    this.room = Game.rooms[roomName];
  }
  public generateCostMatrix(): boolean {
    let generationSuccessful = false;
    if (this.room) {
      // Set structure positions as unwalkable.
      this.room.find(FIND_STRUCTURES).forEach(structure => {
        switch (structure.structureType) {
          case STRUCTURE_ROAD:
            // We love roads.
            this.costMatrix.set(structure.pos.x, structure.pos.y, 1);
            break;
          case STRUCTURE_CONTAINER:
            // Container position may be unwalkable, may not be.
            // We'll use terrain defaults then.
            this.costMatrix.set(structure.pos.x, structure.pos.y, 0);
            break;
          case STRUCTURE_WALL:
            this.costMatrix.set(structure.pos.x, structure.pos.y, 0xff);
            break;
          case STRUCTURE_RAMPART:
            // Rampart position may be unwalkable, may not be.
            if (!structure.my) {
              // but definitely unwalkable if it isn't ours.
              this.costMatrix.set(structure.pos.x, structure.pos.y, 0xff);
            }
            break;
          default:
            this.costMatrix.set(structure.pos.x, structure.pos.y, 0xff);
            break;
        }
      });
      // We'll also avoid creeps by default
      this.room.find(FIND_CREEPS).forEach(creep => {
        this.costMatrix.set(creep.pos.x, creep.pos.y, 0xff);
      });
      generationSuccessful = true;
    }
    return generationSuccessful;
  }
}
