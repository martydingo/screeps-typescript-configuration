/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GameMonitor } from "classes/Monitor/GameMonitor";
import { Log } from "classes/Log";
import { Operator } from "classes/Operator";
import { garbageCollect } from "common/utilities/garbageCollect";
import { Monitor } from "classes/Monitor";
import { MemoryController } from "classes/MemoryController";
import * as Profiler from "Profiler";

global.Profiler = Profiler.init();
export const loop = () => {
  Log.Informational(`Current game tick is ${Game.time}`);
  garbageCollect.creeps();
  new MemoryController();
  new Monitor();
  new Operator();
  new GameMonitor();
  // resetQueues.resetAllQueues();
};
