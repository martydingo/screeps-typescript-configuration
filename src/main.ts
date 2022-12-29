import { GameMonitor } from "classes/Monitor/GameMonitor";
import { Log } from "classes/Log";
import { Operator } from "classes/Operator";
import { Queue } from "classes/Queue";
import { garbageCollect } from "common/utilities/garbageCollect";
import { Monitor } from "classes/Monitor";
import { MemoryController } from "classes/MemoryController";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = () => {
  Log.Informational(`Current game tick is ${Game.time}`);
  garbageCollect.creeps();
  new MemoryController();
  new Monitor();
  new Queue();
  new Operator();
  new GameMonitor();
  // resetQueues.resetAllQueues();
};
