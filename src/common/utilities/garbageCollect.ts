import { Log } from "classes/Log";

export const garbageCollect = {
  creeps(): void {
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        Log.Debug(`Clearing ${name} Creep Memory`);
        delete Memory.creeps[name];
      }
    }
  }
};
