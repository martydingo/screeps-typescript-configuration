const __PROFILER_ENABLED__ = true
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* tslint:disable:ban-types */
function init() {
    const defaults = {
        data: {},
        total: 0
    };
    if (!Memory.profiler) {
        Memory.profiler = defaults;
    }
    const cli = {
        clear() {
            const running = isEnabled();
            Memory.profiler = defaults;
            if (running) {
                Memory.profiler.start = Game.time;
            }
            return "Profiler Memory cleared";
        },
        output() {
            outputProfilerData();
            return "Done";
        },
        start() {
            Memory.profiler.start = Game.time;
            return "Profiler started";
        },
        status() {
            if (isEnabled()) {
                return "Profiler is running";
            }
            return "Profiler is stopped";
        },
        stop() {
            if (!isEnabled()) {
                return;
            }
            const timeRunning = Game.time - Memory.profiler.start;
            Memory.profiler.total += timeRunning;
            delete Memory.profiler.start;
            return "Profiler stopped";
        },
        toString() {
            return ("Profiler.start() - Starts the profiler\n" +
                "Profiler.stop() - Stops/Pauses the profiler\n" +
                "Profiler.status() - Returns whether is profiler is currently running or not\n" +
                "Profiler.output() - Pretty-prints the collected profiler data to the console\n" +
                this.status());
        }
    };
    return cli;
}
function wrapFunction(obj, key, className) {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
    if (!descriptor || descriptor.get || descriptor.set) {
        return;
    }
    if (key === "constructor") {
        return;
    }
    const originalFunction = descriptor.value;
    if (!originalFunction || typeof originalFunction !== "function") {
        return;
    }
    // set a key for the object in memory
    if (!className) {
        className = obj.constructor ? `${obj.constructor.name}` : "";
    }
    const memKey = className + `:${key}`;
    // set a tag so we don't wrap a function twice
    const savedName = `__${key}__`;
    if (Reflect.has(obj, savedName)) {
        return;
    }
    Reflect.set(obj, savedName, originalFunction);
    // /////////
    Reflect.set(obj, key, function (...args) {
        if (isEnabled()) {
            const start = Game.cpu.getUsed();
            const result = originalFunction.apply(this, args);
            const end = Game.cpu.getUsed();
            record(memKey, end - start);
            return result;
        }
        return originalFunction.apply(this, args);
    });
}
function profile(target, key, _descriptor) {
    if (!__PROFILER_ENABLED__) {
        return;
    }
    if (key) {
        // case of method decorator
        wrapFunction(target, key);
        return;
    }
    // case of class decorator
    const ctor = target;
    if (!ctor.prototype) {
        return;
    }
    const className = ctor.name;
    Reflect.ownKeys(ctor.prototype).forEach(k => {
        wrapFunction(ctor.prototype, k, className);
    });
}
function isEnabled() {
    return Memory.profiler.start !== undefined;
}
function record(key, time) {
    if (!Memory.profiler.data[key]) {
        Memory.profiler.data[key] = {
            calls: 0,
            time: 0
        };
    }
    Memory.profiler.data[key].calls++;
    Memory.profiler.data[key].time += time;
}
function outputProfilerData() {
    let totalTicks = Memory.profiler.total;
    if (Memory.profiler.start) {
        totalTicks += Game.time - Memory.profiler.start;
    }
    // /////
    // Process data
    let totalCpu = 0; // running count of average total CPU use per tick
    let calls;
    let time;
    let result;
    const data = Reflect.ownKeys(Memory.profiler.data).map(key => {
        calls = Memory.profiler.data[key].calls;
        time = Memory.profiler.data[key].time;
        result = {};
        result.name = `${key}`;
        result.calls = calls;
        result.cpuPerCall = time / calls;
        result.callsPerTick = calls / totalTicks;
        result.cpuPerTick = time / totalTicks;
        totalCpu += result.cpuPerTick;
        return result;
    });
    data.sort((lhs, rhs) => rhs.cpuPerTick - lhs.cpuPerTick);
    // /////
    // Format data
    let output = "";
    // get function name max length
    const longestName = _.max(data, d => d.name.length).name.length + 2;
    // // Header line
    output += _.padRight("Function", longestName);
    output += _.padLeft("Tot Calls", 12);
    output += _.padLeft("CPU/Call", 12);
    output += _.padLeft("Calls/Tick", 12);
    output += _.padLeft("CPU/Tick", 12);
    output += _.padLeft("% of Tot\n", 12);
    // //  Data lines
    data.forEach(d => {
        output += _.padRight(`${d.name}`, longestName);
        output += _.padLeft(`${d.calls}`, 12);
        output += _.padLeft(`${d.cpuPerCall.toFixed(2)}ms`, 12);
        output += _.padLeft(`${d.callsPerTick.toFixed(2)}`, 12);
        output += _.padLeft(`${d.cpuPerTick.toFixed(2)}ms`, 12);
        output += _.padLeft(`${((d.cpuPerTick / totalCpu) * 100).toFixed(0)} %\n`, 12);
    });
    // // Footer line
    output += `${totalTicks} total ticks measured`;
    output += `\t\t\t${totalCpu.toFixed(2)} average CPU profiled per tick`;
    console.log(output);
}
// debugging
// function printObject(obj: object) {
//   const name = obj.constructor ? obj.constructor.name : (obj as any).name;
//   console.log("  Keys of :", name, ":");
//   Reflect.ownKeys(obj).forEach((k) => {
//     try {
//       console.log(`    ${k}: ${Reflect.get(obj, k)}`);
//     } catch (e) {
//       // nothing
//     }
//   });
// }

let GameMonitor = class GameMonitor {
    constructor() {
        this.monitorGame();
    }
    monitorGame() {
        Memory.monitoring = {
            cpu: {
                used: Game.cpu.getUsed(),
                bucket: Game.cpu.bucket
            },
            memory: this.monitorHeapSize(),
            pixels: Game.resources.pixel || 0
        };
    }
    monitorHeapSize() {
        let curHeapSize = 0;
        if (Game.cpu.getHeapStatistics) {
            const heapStats = Game.cpu.getHeapStatistics();
            if (heapStats) {
                curHeapSize = heapStats.used_heap_size;
            }
        }
        return curHeapSize;
    }
};
GameMonitor = __decorate([
    profile
], GameMonitor);

class Log {
    static Emergency(msg) {
        console.log(Log.LogColor.Emergency + msg);
    }
    static Alert(msg) {
        console.log(Log.LogColor.Alert + msg);
    }
    static Critical(msg) {
        console.log(Log.LogColor.Critical + msg);
    }
    static Error(msg) {
        console.log(Log.LogColor.Error + msg);
    }
    static Warning(msg) {
        console.log(Log.LogColor.Warning + msg);
    }
    static Notice(msg) {
        console.log(Log.LogColor.Notice + msg);
    }
    static Informational(msg) {
        console.log(Log.LogColor.Informational + msg);
    }
    static Debug(msg) {
        console.log(Log.LogColor.Debug + msg);
    }
}
Log.LogColor = {
    Emergency: '<font color="#ff0000">',
    Alert: '<font color="#c00000">',
    Critical: '<font color="#c00000">',
    Error: '<font color="#cc5500">',
    Warning: '<font color="#eeaa00">',
    Notice: '<font color="#eeff00">',
    Informational: '<font color="#aaaaaa">',
    Debug: '<font color="#666666">'
};

/* eslint-disable no-bitwise */
// Juszczak/base64-typescript-class.ts
class base64 {
    static getByte(s, i) {
        const x = s.charCodeAt(i);
        return x;
    }
    static getByte64(s, i) {
        const idx = this.ALPHA.indexOf(s.charAt(i));
        return idx;
    }
    static decode(s) {
        let pads = 0;
        let i;
        let b10;
        let imax = s.length;
        const x = [];
        s = String(s);
        if (imax === 0) {
            return s;
        }
        if (s.charAt(imax - 1) === this.PADCHAR) {
            pads = 1;
            if (s.charAt(imax - 2) === this.PADCHAR) {
                pads = 2;
            }
            imax -= 4;
        }
        for (i = 0; i < imax; i += 4) {
            b10 =
                (this.getByte64(s, i) << 18) |
                    (this.getByte64(s, i + 1) << 12) |
                    (this.getByte64(s, i + 2) << 6) |
                    this.getByte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
        }
        switch (pads) {
            case 1:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
                break;
            case 2:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }
        return x.join("");
    }
    static encode(s) {
        s = String(s);
        let i;
        let b10;
        const x = [];
        const imax = s.length - (s.length % 3);
        if (s.length === 0) {
            return s;
        }
        for (i = 0; i < imax; i += 3) {
            b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
            x.push(this.ALPHA.charAt(b10 >> 18));
            x.push(this.ALPHA.charAt((b10 >> 12) & 63));
            x.push(this.ALPHA.charAt((b10 >> 6) & 63));
            x.push(this.ALPHA.charAt(b10 & 63));
        }
        switch (s.length - imax) {
            case 1:
                b10 = this.getByte(s, i) << 16;
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.PADCHAR + this.PADCHAR);
                break;
            case 2:
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                x.push(this.ALPHA.charAt(b10 >> 18) +
                    this.ALPHA.charAt((b10 >> 12) & 63) +
                    this.ALPHA.charAt((b10 >> 6) & 63) +
                    this.PADCHAR);
                break;
        }
        return x.join("");
    }
}
base64.PADCHAR = "=";
base64.ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

class BuildConstructionSiteJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
            jobMemory.jobParameters.room === this.JobParameters.room)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "BuildConstructionSiteJob" for room: "${this.JobParameters.room}" with the UUID "${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "buildConstructionSite"
                },
                index,
                room: this.JobParameters.room,
                jobType: "buildConstructionSite",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "BuildConstructionSiteJob" for room: "${this.JobParameters.room}" with the UUID "${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

const roomsToAvoid = [];

const myScreepsUsername = "Marty";

const findPath = {
    findClearTerrain(roomName) {
        if (Game.rooms[roomName]) {
            const roomTerrainMatrix = Game.rooms[roomName].getTerrain();
            for (let x = 15; x < 35; x++) {
                for (let y = 15; y < 35; y++) {
                    if (roomTerrainMatrix.get(x, y) === 0) {
                        return new RoomPosition(x, y, roomName);
                    }
                }
            }
        }
        return new RoomPosition(25, 25, roomName);
    },
    findClosestSpawnToRoom(roomName) {
        const spawnDistanceMatrix = {};
        Object.entries(Game.spawns)
            .filter(([, spawn]) => spawn.isActive())
            .forEach(([spawnName, spawn]) => {
            let cost = 0;
            Game.map.findRoute(spawn.pos.roomName, roomName, {
                routeCallback() {
                    cost = cost + 1;
                }
            });
            spawnDistanceMatrix[spawnName] = cost;
        });
        Object.entries(spawnDistanceMatrix).sort(([spawnNameA], [spawnNameB]) => spawnDistanceMatrix[spawnNameB] - spawnDistanceMatrix[spawnNameA]);
        const spawnName = Object.entries(spawnDistanceMatrix)[0][0];
        return Game.spawns[spawnName];
    },
    findClosestStorageToRoom(originRoomName) {
        const storageDistanceMatrix = {};
        Object.entries(Game.rooms).forEach(([roomName, room]) => {
            if (room.storage && room.storage.my) {
                let cost = 0;
                Game.map.findRoute(originRoomName, roomName, {
                    routeCallback() {
                        cost = cost + 1;
                    }
                });
                storageDistanceMatrix[roomName] = cost;
            }
        });
        Object.entries(storageDistanceMatrix).sort(([storageRoomA], [storageRoomB]) => storageDistanceMatrix[storageRoomA] - storageDistanceMatrix[storageRoomB]);
        const storageRoom = Object.entries(storageDistanceMatrix)[0][0];
        return Game.rooms[storageRoom].storage;
    },
    findSafePathToRoom(originRoomName, destinationRoomName) {
        const safeRoute = Game.map.findRoute(originRoomName, destinationRoomName, {
            routeCallback(nextRoom) {
                var _a, _b;
                let roomMonitored = false;
                if (nextRoom === "W55N11") {
                    return 1;
                }
                if (Game.rooms[nextRoom]) {
                    if (((_b = (_a = Game.rooms[nextRoom].controller) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.username) === myScreepsUsername) {
                        return 1;
                    }
                    else {
                        return 999.999;
                    }
                }
                if (roomsToAvoid.includes(nextRoom)) {
                    return 999.999;
                }
                Object.entries(Memory.rooms).forEach(([roomName]) => {
                    if (nextRoom === roomName) {
                        roomMonitored = true;
                    }
                });
                if (roomMonitored) {
                    return 1;
                }
                else {
                    return 2;
                }
            }
        });
        return safeRoute;
    }
};

const creepNumbers = {
    mineSource: 1,
    workTerminal: 1,
    feedSpawn: 2,
    feedTower: 1,
    feedLink: 1,
    buildConstructionSite: 1,
    upgradeController: 1,
    lootResource: 1,
    scoutRoom: 1,
    claimRoom: 1,
    defendRoom: 1,
    reserveRoom: 1,
    transportResource: 2,
    terminalEngineer: 1,
    labEngineer: 1,
    factoryEngineer: 1,
    tankRoom: 0,
    dismantleEnemyBuildings: 1
};

let ConstructionSiteOperator = class ConstructionSiteOperator {
    constructor() {
        this.operateConstructionSites();
    }
    cleanConstructionSites(roomName) {
        if (Object.entries(Memory.rooms[roomName].monitoring.constructionSites).length === 0) {
            this.deleteConstructionSiteJob(roomName);
        }
        else {
            Object.entries(Memory.rooms[roomName].monitoring.constructionSites).forEach(([constructionSiteIdString]) => {
                const constructionSiteId = constructionSiteIdString;
                const constructionSite = Game.getObjectById(constructionSiteId);
                if (!constructionSite) {
                    delete Memory.rooms[roomName].monitoring.constructionSites[constructionSiteId];
                }
            });
        }
    }
    createConstructionSiteJob(roomName) {
        let spawnRoom = roomName;
        if (Object.entries(Memory.rooms[roomName].monitoring.structures.spawns).length === 0) {
            spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
        }
        const JobParameters = {
            status: "fetchingResource",
            room: roomName,
            spawnRoom,
            jobType: "buildConstructionSite"
        };
        const count = creepNumbers[JobParameters.jobType];
        new BuildConstructionSiteJob(JobParameters, count);
    }
    deleteConstructionSiteJob(roomName) {
        let spawnRoom = roomName;
        if (Object.entries(Memory.rooms[roomName].monitoring.structures.spawns).filter(([, spawn]) => spawn.structure.hits > 0).length === 0) {
            spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
        }
        const JobParameters = {
            status: "fetchingResource",
            room: roomName,
            spawnRoom,
            jobType: "buildConstructionSite"
        };
        new BuildConstructionSiteJob(JobParameters, 0);
    }
    operateConstructionSites() {
        if (Memory.rooms) {
            for (const roomName in Memory.rooms) {
                this.cleanConstructionSites(roomName);
                const constructionSitesInRoom = Object.entries(Memory.rooms[roomName].monitoring.constructionSites);
                if (constructionSitesInRoom.length > 0) {
                    this.createConstructionSiteJob(roomName);
                }
            }
        }
    }
};
ConstructionSiteOperator = __decorate([
    profile
], ConstructionSiteOperator);

class UpgradeControllerJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
            jobMemory.jobParameters.controllerId === this.JobParameters.controllerId)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.controllerId}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.controllerId}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "UpgradeControllerJob" for Controller ID: "${this.JobParameters.controllerId}" with the UUID "${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "upgradeController",
                    controllerId: this.JobParameters.controllerId
                },
                index,
                room: this.JobParameters.room,
                jobType: "upgradeController",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "UpgradeControllerJob" for Controller ID: "${this.JobParameters.controllerId}" with the UUID "${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

const creepNumbersOverride = {
    // W00N00: {
    //   mineSource: 0,
    //   workTerminal: 0,
    //   feedSpawn: 0,
    //   feedTower: 0,
    //   feedLink: 0,
    //   buildConstructionSite: 0,
    //   upgradeController: 0,
    //   lootResource: 0,
    //   scoutRoom: 0,
    //   claimRoom: 0,
    //   defendRoom: 0,
    //   reserveRoom: 0,
    //   transportResource: 0,
    //   terminalEngineer: 0,
    //   labEngineer: 0,
    //   factoryEngineer: 0,
    //   tankRoom: 0,
    //   dismantleEnemyBuildings: 0
    // }
    W56N12: {
        upgradeController: -1
    }
};

let ControllerOperator = class ControllerOperator {
    constructor() {
        this.operateController();
    }
    operateController() {
        var _a;
        if (Memory.rooms) {
            for (const roomName in Memory.rooms) {
                if (Memory.rooms[roomName].monitoring.structures.controller) {
                    const controllerId = (_a = Memory.rooms[roomName].monitoring.structures.controller) === null || _a === void 0 ? void 0 : _a.id;
                    if (controllerId) {
                        const controller = Game.getObjectById(controllerId);
                        if (controller) {
                            if (controller.my) {
                                let spawnRoom = controller.pos.roomName;
                                if (Object.entries(controller.room.memory.monitoring.structures.spawns).length === 0) {
                                    spawnRoom = findPath.findClosestSpawnToRoom(controller.pos.roomName).pos.roomName;
                                }
                                const JobParameters = {
                                    status: "fetchingResource",
                                    room: controller.pos.roomName,
                                    spawnRoom,
                                    jobType: "upgradeController",
                                    controllerId: controller.id
                                };
                                let count = creepNumbers[JobParameters.jobType];
                                if (creepNumbersOverride[roomName]) {
                                    if (creepNumbersOverride[roomName][JobParameters.jobType]) {
                                        count = count + creepNumbersOverride[roomName][JobParameters.jobType];
                                    }
                                }
                                new UpgradeControllerJob(JobParameters, count);
                            }
                        }
                    }
                }
            }
        }
    }
};
ControllerOperator = __decorate([
    profile
], ControllerOperator);

const movePathColors = {
    mineSource: "#FFEB3B",
    workTerminal: "#66BB6A",
    feedSpawn: "#DCE775",
    feedTower: "#D4E157",
    feedLink: "#CDDC39",
    buildConstructionSite: "#FFB300",
    dismantleEnemyBuildings: "#FFB300",
    upgradeController: "#FF5722",
    lootResource: "#009688",
    scoutRoom: "#424242",
    tankRoom: "#646464",
    claimRoom: "#1A237E",
    defendRoom: "#B91C1C",
    reserveRoom: "#5C6BC0",
    transportResource: "#00897B",
    terminalEngineer: "#2E7D32",
    labEngineer: "#03A9F4",
    factoryEngineer: "#607D8B"
};

let BaseCreep = class BaseCreep {
    constructor(creep) {
        if (creep.memory.status === "recyclingCreep") {
            const closestSpawn = findPath.findClosestSpawnToRoom(creep.pos.roomName);
            if (closestSpawn) {
                const recycleResult = closestSpawn.recycleCreep(creep);
                if (recycleResult === ERR_NOT_IN_RANGE) {
                    this.moveCreep(creep, closestSpawn.pos);
                }
                else {
                    if (recycleResult === OK) {
                        Log.Debug(`${creep.name} of creepType ${creep.memory.jobType} in ${creep.pos.roomName} has been recycled`);
                    }
                    else {
                        Log.Warning(`${creep.name} of creepType ${creep.memory.jobType} in ${creep.pos.roomName} has encountered a ${recycleResult} error while attempting to be recycled`);
                    }
                }
            }
        }
    }
    checkIfFull(creep, resource) {
        if (creep.memory.status === "fetchingResource") {
            if (creep.store.getFreeCapacity(resource) === 0) {
                if (creep.store.getCapacity(resource) === creep.store[resource]) {
                    creep.memory.status = "working";
                }
                else {
                    if (creep.store.getFreeCapacity(resource) === 0) {
                        Object.entries(creep.store).forEach(([resourceType]) => {
                            if (resourceType !== resource) {
                                if (resourceType === RESOURCE_ENERGY) {
                                    if (creep.room.storage) {
                                        this.depositResource(creep, creep.room.storage, resourceType);
                                    }
                                }
                                else {
                                    if (creep.room.terminal) {
                                        this.depositResource(creep, creep.room.terminal, resourceType);
                                    }
                                    else {
                                        creep.drop(resourceType);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        else if (creep.memory.status === "working") {
            if (creep.store[resource] === 0 && creep.store.getFreeCapacity(resource) > 0) {
                creep.memory.status = "fetchingResource";
            }
        }
    }
    boostBodyParts(creep, bodyPart, mineral) {
        const creepSpecificBodyPartCount = creep.body.filter(creepBodyPart => creepBodyPart.type === bodyPart).length;
        const creepSpecificBoostedBodyPartCount = creep.body.filter(creepBodyPart => creepBodyPart.type === bodyPart && creepBodyPart.boost === mineral).length;
        if (creepSpecificBodyPartCount !== creepSpecificBoostedBodyPartCount) {
            const mineralString = mineral.toString().toUpperCase();
            const labsWithMineral = Object.entries(creep.room.memory.monitoring.structures.labs).filter(([, labMonitorMemory]) => labMonitorMemory.resources[mineralString]);
            if (!creep.spawning) {
                if (labsWithMineral.length > 0) {
                    const labId = labsWithMineral[0][0];
                    const lab = Game.getObjectById(labId);
                    if (lab) {
                        if (lab.store[RESOURCE_ENERGY] > LAB_ENERGY_CAPACITY / 10) {
                            creep.memory.status = "fetchingBoosts";
                            const boostResult = lab.boostCreep(creep);
                            if (boostResult === ERR_NOT_IN_RANGE) {
                                this.moveCreep(creep, lab.pos);
                            }
                            else {
                                if (boostResult !== OK) {
                                    Log.Warning(`${creep.name} in ${creep.room.name} has encountered a ${boostResult} error code while trying to boost bodyparts with the mineral ${mineral}`);
                                }
                                else {
                                    creep.memory.status = "working";
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            if (creep.memory.status === "fetchingBoosts") {
                creep.memory.status = "working";
            }
        }
    }
    moveHome(creep) {
        if (creep.memory.status === "working" || creep.memory.status === "fetchingResource") {
            if (creep.pos.roomName !== creep.memory.room) {
                creep.memory.status = "movingIntoRoom";
            }
        }
        if (creep.memory.status === "movingIntoRoom") {
            if (creep.pos.roomName === creep.memory.room) {
                delete creep.memory.safeRoute;
                creep.memory.status = "working";
            }
            else {
                // this.moveCreep(creep, new RoomPosition(25, 25, creep.memory.room));
                if (!creep.memory.safeRoute) {
                    creep.memory.safeRoute = this.fetchSafePath(creep, creep.memory.room);
                }
                this.moveCreep(creep, creep.memory.safeRoute[0]);
            }
        }
    }
    fetchSafePath(creep, destinationRoomName) {
        const safeRoute = [];
        const safeExits = findPath.findSafePathToRoom(creep.pos.roomName, destinationRoomName);
        if (safeExits !== -2) {
            Object.entries(safeExits).forEach(([roomExitArrayIndexString, roomExitArrayDictionary]) => {
                const roomExitArrayIndexUnknown = roomExitArrayIndexString;
                const roomExitArrayIndex = roomExitArrayIndexUnknown;
                const roomPositionCoordinates = findPath.findClearTerrain(roomExitArrayDictionary.room);
                safeRoute[roomExitArrayIndex] = roomPositionCoordinates;
            });
        }
        return safeRoute;
    }
    moveCreep(creep, destination) {
        let nextDestination = new RoomPosition(destination.x, destination.y, destination.roomName);
        if (creep.pos.roomName !== destination.roomName) {
            if (!creep.memory.safeRoute) {
                creep.memory.safeRoute = this.fetchSafePath(creep, destination.roomName);
            }
        }
        if (creep.memory.safeRoute) {
            if (Object.entries(creep.memory.safeRoute).length > 1) {
                if (creep.memory.safeRoute[0].roomName === creep.pos.roomName) {
                    const newCreepSafeRouteMemory = Object.entries(creep.memory.safeRoute).splice(0, 1);
                    const creepSafeRouteArray = [];
                    newCreepSafeRouteMemory.forEach(([, safeRouteRoomPosition]) => {
                        creepSafeRouteArray.push(safeRouteRoomPosition);
                    });
                    creep.memory.safeRoute = creepSafeRouteArray;
                    nextDestination = new RoomPosition(creep.memory.safeRoute[0].x, creep.memory.safeRoute[0].y, creep.memory.safeRoute[0].roomName);
                }
            }
            if (Object.entries(creep.memory.safeRoute).length === 1) {
                if (creep.pos.roomName === creep.memory.safeRoute[0].roomName) {
                    delete creep.memory.safeRoute;
                }
                else {
                    nextDestination = new RoomPosition(creep.memory.safeRoute[0].x, creep.memory.safeRoute[0].y, creep.memory.safeRoute[0].roomName);
                }
            }
        }
        const moveResult = creep.moveTo(nextDestination, {
            visualizePathStyle: {
                fill: "transparent",
                stroke: movePathColors[creep.memory.jobType],
                lineStyle: "dotted",
                strokeWidth: 0.1,
                opacity: 0.66
            }
        });
        return moveResult;
    }
    harvestSource(creep, source) {
        const harvestResult = creep.harvest(source);
        if (harvestResult === ERR_NOT_IN_RANGE) {
            const moveResult = this.moveCreep(creep, source.pos);
            return moveResult;
        }
        else {
            return harvestResult;
        }
    }
    pickupResource(creep, origin) {
        const pickupResult = creep.pickup(origin);
        if (pickupResult === ERR_NOT_IN_RANGE) {
            const moveResult = this.moveCreep(creep, origin.pos);
            return moveResult;
        }
        else
            return pickupResult;
    }
    withdrawResource(creep, origin, resource) {
        const withdrawResult = creep.withdraw(origin, resource);
        if (withdrawResult === ERR_NOT_IN_RANGE) {
            const moveResult = this.moveCreep(creep, origin.pos);
            return moveResult;
        }
        else
            return withdrawResult;
    }
    fetchSource(creep, forceStorage = false) {
        const linkDistances = {};
        let sortedLinkDistances = [];
        let storageUsable = false;
        let linksUsable = false;
        let useStorage = false;
        let useLinks = false;
        if (forceStorage) {
            useStorage = true;
        }
        else {
            if (creep.room.memory.monitoring.structures.links) {
                if (Object.entries(creep.room.memory.monitoring.structures.links).filter(([, cachedLink]) => cachedLink.mode === "rx" && cachedLink.energy.energyAvailable > 0).length > 0) {
                    linksUsable = true;
                }
            }
            if (creep.room.memory.monitoring.structures.storage) {
                if (creep.room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY]) {
                    if (creep.room.memory.monitoring.structures.storage.resources[RESOURCE_ENERGY].resourceAmount >=
                        creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                        storageUsable = true;
                    }
                }
            }
        }
        if (storageUsable || linksUsable) {
            if (!linksUsable) {
                useStorage = true;
            }
            else {
                if (!storageUsable) {
                    useLinks = true;
                }
                else {
                    Object.entries(creep.room.memory.monitoring.structures.links)
                        .filter(([, cachedLink]) => cachedLink.mode === "rx" && cachedLink.energy.energyAvailable > 0)
                        .forEach(([cachedLinkIdString]) => {
                        const cachedLinkId = cachedLinkIdString;
                        const cachedLink = Game.getObjectById(cachedLinkId);
                        if (cachedLink) {
                            linkDistances[cachedLinkId] = creep.pos.getRangeTo(cachedLink);
                        }
                    });
                    if (Object.entries(linkDistances).length > 0) {
                        sortedLinkDistances = Object.entries(linkDistances).sort(([, linkDistanceA], [, linkDistanceB]) => linkDistanceA - linkDistanceB);
                        if (sortedLinkDistances[0]) {
                            if (creep.room.storage) {
                                const storageDistance = creep.pos.getRangeTo(creep.room.storage.pos);
                                if (storageDistance <= sortedLinkDistances[0][1]) {
                                    useStorage = true;
                                }
                                else {
                                    useLinks = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (useLinks === true) {
            if (Object.entries(sortedLinkDistances)[0]) {
                const linkId = sortedLinkDistances[0][0];
                const link = Game.getObjectById(linkId);
                if (link) {
                    this.withdrawResource(creep, link, RESOURCE_ENERGY);
                }
            }
        }
        else {
            if (useStorage === true) {
                if (creep.room.memory.monitoring.structures.storage) {
                    const storageId = creep.room.memory.monitoring.structures.storage.id;
                    const storage = Game.getObjectById(storageId);
                    if (storage) {
                        this.withdrawResource(creep, storage, RESOURCE_ENERGY);
                    }
                }
            }
            else {
                const droppedResourceArray = [];
                Object.entries(creep.room.memory.monitoring.droppedResources)
                    .filter(DroppedResource => DroppedResource[1].resourceType === RESOURCE_ENERGY)
                    .forEach(([droppedResourceId]) => {
                    const droppedResource = Game.getObjectById(droppedResourceId);
                    if (droppedResource) {
                        droppedResourceArray.push(droppedResource);
                    }
                });
                if (droppedResourceArray.length > 0) {
                    const closestDroppedEnergy = creep.pos.findClosestByPath(droppedResourceArray);
                    if (closestDroppedEnergy) {
                        this.pickupResource(creep, closestDroppedEnergy);
                    }
                }
                else {
                    if (Object.entries(creep.body).filter(([, bodyPart]) => bodyPart.type === WORK)) {
                        const sourceArray = [];
                        Object.entries(creep.room.memory.monitoring.sources).forEach(([sourceId]) => {
                            const source = Game.getObjectById(sourceId);
                            if (source) {
                                if (source.energy <= source.energyCapacity) {
                                    sourceArray.push(source);
                                }
                            }
                        });
                        if (sourceArray.length > 0) {
                            const closestSource = creep.pos.findClosestByPath(sourceArray);
                            if (closestSource) {
                                this.harvestSource(creep, closestSource);
                            }
                        }
                    }
                }
            }
        }
    }
    depositResource(creep, destination, resource) {
        const depositResult = creep.transfer(destination, resource);
        if (depositResult === ERR_NOT_IN_RANGE) {
            const moveResult = this.moveCreep(creep, destination.pos);
            return moveResult;
        }
        else
            return depositResult;
    }
    healCreep(creep, targetCreep) {
        if (!targetCreep) {
            targetCreep = creep;
        }
        const healResult = creep.heal(targetCreep);
        if (healResult === ERR_NOT_IN_RANGE) {
            this.moveCreep(creep, targetCreep.pos);
        }
        else {
            if (healResult !== OK) {
                Log.Alert(`${creep.name} in room ${creep.pos.roomName} tried to heal ${targetCreep.name} in room ${targetCreep.pos.roomName}, but failed with a result of ${healResult}`);
            }
        }
    }
    attackCreep(creep, targetCreep) {
        const attackResult = creep.attack(targetCreep);
        if (attackResult === ERR_NOT_IN_RANGE) {
            this.moveCreep(creep, targetCreep.pos);
        }
        else {
            if (attackResult !== OK) {
                Log.Alert(`${creep.name} in room ${creep.pos.roomName} tried to attack ${targetCreep.name} in room ${targetCreep.pos.roomName}, but failed with a result of ${attackResult}`);
            }
        }
    }
};
BaseCreep = __decorate([
    profile
], BaseCreep);

let BuildConstructionSiteCreep = class BuildConstructionSiteCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.moveHome(creep);
        if (creep.memory.status === "working" || creep.memory.status === "fetchingResource") {
            this.checkIfFull(creep, RESOURCE_ENERGY);
        }
        if (creep.memory.status === "working") {
            const constructionSites = Object.entries(Memory.rooms[creep.memory.room].monitoring.constructionSites).sort(([, constructionSiteMemoryA], [, constructionSiteMemoryB]) => 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-return
            constructionSiteMemoryA.progress + constructionSiteMemoryB.progress);
            if (constructionSites[0]) {
                const constructionSiteId = constructionSites[0][0];
                if (constructionSiteId) {
                    const constructionSite = Game.getObjectById(constructionSiteId);
                    if (constructionSite) {
                        this.buildConstructionSite(creep, constructionSite);
                    }
                    else {
                        this.moveCreep(creep, findPath.findClearTerrain(creep.memory.room));
                    }
                }
            }
        }
        else if (creep.memory.status === "fetchingResource") {
            this.fetchSource(creep);
        }
    }
    buildConstructionSite(creep, constructionSite) {
        const upgradeResult = creep.build(constructionSite);
        if (upgradeResult === ERR_NOT_IN_RANGE) {
            const moveResult = this.moveCreep(creep, constructionSite.pos);
            return moveResult;
        }
        else {
            return upgradeResult;
        }
    }
};
BuildConstructionSiteCreep = __decorate([
    profile
], BuildConstructionSiteCreep);

let ClaimRoomCreep = class ClaimRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.moveHome(creep);
        if (creep.memory.status === "working") {
            if (Memory.rooms[creep.memory.room].monitoring.structures.controller) {
                const controllerToClaimMemory = Memory.rooms[creep.memory.room].monitoring.structures.controller;
                if (controllerToClaimMemory) {
                    const controllerToClaimId = controllerToClaimMemory.id;
                    if (controllerToClaimId) {
                        const controllerToClaim = Game.getObjectById(controllerToClaimId);
                        if (controllerToClaim) {
                            const claimResult = creep.claimController(controllerToClaim);
                            if (claimResult === ERR_NOT_IN_RANGE) {
                                this.moveCreep(creep, controllerToClaim.pos);
                            }
                            else if (claimResult === ERR_NOT_OWNER) {
                                const attackControllerResult = creep.attackController(controllerToClaim);
                                if (attackControllerResult === ERR_NOT_IN_RANGE) {
                                    this.moveCreep(creep, controllerToClaim.pos);
                                }
                                else {
                                    Log.Warning(`Attack Controller Result for ${creep.name} in ${creep.pos.roomName}: ${attackControllerResult}`);
                                }
                            }
                            else
                                Log.Warning(`Claim Result for ${creep.name} in ${creep.pos.roomName}: ${claimResult}`);
                        }
                    }
                }
            }
        }
    }
};
ClaimRoomCreep = __decorate([
    profile
], ClaimRoomCreep);

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
function fetchHostileCreep(room) {
    const cachedHostiles = Object.entries(room.memory.monitoring.hostiles);
    if (cachedHostiles.length === 1) {
        const hostileIdUnknown = cachedHostiles[0][0];
        const hostileId = hostileIdUnknown;
        const hostile = Game.getObjectById(hostileId);
        if (hostile) {
            return hostile;
        }
    }
    else {
        if (cachedHostiles.length > 1) {
            const cachedHostilesThatHeal = cachedHostiles.filter(([, cachedHostileMemory]) => cachedHostileMemory.bodyParts.includes(HEAL) === true);
            if (cachedHostilesThatHeal.length === 1) {
                const hostileIdUnknown = cachedHostilesThatHeal[0][0];
                const hostileId = hostileIdUnknown;
                const hostile = Game.getObjectById(hostileId);
                if (hostile) {
                    return hostile;
                }
            }
            else {
                if (cachedHostilesThatHeal.length > 1) {
                    const cachedHostilesThatHealLowestHP = cachedHostiles.sort(([, cachedHostileMemoryA], [, cachedHostileMemoryB]) => cachedHostileMemoryA.health.hits - cachedHostileMemoryB.health.hits);
                    const hostileIdUnknown = cachedHostilesThatHealLowestHP[0][0];
                    const hostileId = hostileIdUnknown;
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

let DefendRoomCreep = class DefendRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        if (Object.entries(creep.body).filter(([, bodyPart]) => bodyPart.type === HEAL).length > 0) {
            if (creep.hits < creep.hitsMax) {
                this.healCreep(creep);
            }
        }
        if (creep.memory.status !== "recyclingCreep") {
            this.moveHome(creep);
            if (creep.memory.status === "working") {
                const hostileCreep = fetchHostileCreep(creep.room);
                if (hostileCreep) {
                    this.attackCreep(creep, hostileCreep);
                }
                else {
                    creep.memory.status = "recyclingCreep";
                }
            }
        }
    }
};
DefendRoomCreep = __decorate([
    profile
], DefendRoomCreep);

let DismantleEnemyBuildingsCreep = class DismantleEnemyBuildingsCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.moveHome(creep);
        if (creep.memory.status === "working") {
            let buildingToDismantle;
            if (creep.room.name === creep.memory.room) {
                if (creep.room.memory.monitoring.structures.spawns) {
                    const cachedSpawnsInRoomDictionary = Object.entries(creep.room.memory.monitoring.structures.spawns);
                    if (cachedSpawnsInRoomDictionary.length > 0) {
                        if (cachedSpawnsInRoomDictionary.length === 1) {
                            const spawnToDismantleId = cachedSpawnsInRoomDictionary[0][1].id;
                            const spawnToDismantle = Game.getObjectById(spawnToDismantleId);
                            if (spawnToDismantle) {
                                buildingToDismantle = spawnToDismantle;
                            }
                        }
                    }
                    else {
                        const manualRampartToKill = Game.getObjectById("63341e08b0485dbcf5342fd4");
                        if (manualRampartToKill) {
                            buildingToDismantle = manualRampartToKill;
                        }
                    }
                }
            }
            if (buildingToDismantle) {
                const dismantleResult = creep.dismantle(buildingToDismantle);
                if (dismantleResult === ERR_NOT_IN_RANGE) {
                    this.moveCreep(creep, buildingToDismantle.pos);
                }
                else {
                    if (dismantleResult !== OK) {
                        Log.Alert(`${creep.name} in ${creep.room.name} encountered a ${dismantleResult} error while attempting to dismantle ${buildingToDismantle.structureType} - ${buildingToDismantle.id}`);
                    }
                }
            }
        }
    }
};
DismantleEnemyBuildingsCreep = __decorate([
    profile
], DismantleEnemyBuildingsCreep);

let FactoryEngineerCreep = class FactoryEngineerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        if (creep.memory.status === "awaitingJob") {
            if (Object.entries(creep.room.memory.queues.factoryQueue).length > 0) {
                this.assignFactoryJob(creep);
            }
            else {
                this.deassignFactoryJob(creep);
            }
        }
        if (creep.memory.status !== "awaitingJob") {
            if (creep.memory.factoryJobUUID) {
                const nextJobParameters = creep.room.memory.queues.factoryQueue[creep.memory.factoryJobUUID];
                if (nextJobParameters) {
                    // Mux FactoryJobs
                    switch (nextJobParameters.factoryJobType) {
                        case "feedFactoryEnergy":
                            this.runFeedFactoryEnergyJob(creep);
                            break;
                        default:
                            Log.Alert(
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            `FactoryEngineer ${creep.name} in room ${creep.room.name} cannot understand the factoryJobType: ${nextJobParameters.factoryJobType}`);
                            break;
                    }
                }
                else {
                    this.deassignFactoryJob(creep);
                }
            }
        }
    }
    assignFactoryJob(creep) {
        const factoryJobs = Object.entries(creep.room.memory.queues.factoryQueue);
        const nextFactoryJobUUID = factoryJobs.sort(([, factoryJobMemoryA], [, factoryJobMemoryB]) => factoryJobMemoryA.priority - factoryJobMemoryB.priority)[0][0];
        creep.memory.factoryJobUUID = nextFactoryJobUUID;
        creep.memory.status = "working";
    }
    deassignFactoryJob(creep) {
        delete creep.memory.factoryJobUUID;
        creep.memory.status = "awaitingJob";
    }
    runFeedFactoryEnergyJob(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            this.fetchSource(creep, true);
        }
        else if (creep.memory.status === "working") {
            const factoryMemory = creep.room.memory.monitoring.structures.factory;
            if (factoryMemory) {
                const factory = Game.getObjectById(factoryMemory.id);
                if (factory) {
                    this.depositResource(creep, factory, RESOURCE_ENERGY);
                }
            }
        }
    }
};
FactoryEngineerCreep = __decorate([
    profile
], FactoryEngineerCreep);

let FeedLinkCreep = class FeedLinkCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            // Second argument forces use of storage
            this.fetchSource(creep, true);
        }
        else if (creep.memory.status === "working") {
            if (creep.memory.linkId) {
                const link = Game.getObjectById(creep.memory.linkId);
                if (link) {
                    this.depositResource(creep, link, RESOURCE_ENERGY);
                }
            }
        }
    }
};
FeedLinkCreep = __decorate([
    profile
], FeedLinkCreep);

let FeedSpawnCreep = class FeedSpawnCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            this.fetchSource(creep);
        }
        else {
            if (creep.memory.status === "working") {
                const notFullSpawnObjectArray = [];
                if (creep.room.memory.monitoring.structures.spawns) {
                    Object.entries(creep.room.memory.monitoring.structures.spawns)
                        .filter(Spawn => Game.spawns[Spawn[0]].room === creep.room &&
                        Game.spawns[Spawn[0]].store[RESOURCE_ENERGY] < Game.spawns[Spawn[0]].store.getCapacity(RESOURCE_ENERGY))
                        .forEach(([spawnName]) => {
                        const spawn = Game.spawns[spawnName];
                        notFullSpawnObjectArray.push(spawn);
                    });
                }
                if (creep.room.memory.monitoring.structures.extensions) {
                    Object.entries(creep.room.memory.monitoring.structures.extensions)
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        .filter(([, ExtensionMemory]) => ExtensionMemory.energyAvailable < ExtensionMemory.energyCapacity)
                        .forEach(([extensionIdString]) => {
                        const extensionId = extensionIdString;
                        const extension = Game.getObjectById(extensionId);
                        if (extension) {
                            notFullSpawnObjectArray.push(extension);
                        }
                    });
                }
                const closestNotFullSpawnObject = creep.pos.findClosestByPath(notFullSpawnObjectArray);
                if (closestNotFullSpawnObject) {
                    this.depositResource(creep, closestNotFullSpawnObject, RESOURCE_ENERGY);
                }
            }
        }
    }
};
FeedSpawnCreep = __decorate([
    profile
], FeedSpawnCreep);

let FeedTowerCreep = class FeedTowerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            this.fetchSource(creep);
        }
        else if (creep.memory.status === "working") {
            if (creep.memory.towerId) {
                const tower = Game.getObjectById(creep.memory.towerId);
                if (tower) {
                    this.depositResource(creep, tower, RESOURCE_ENERGY);
                }
            }
        }
    }
};
FeedTowerCreep = __decorate([
    profile
], FeedTowerCreep);

let LabEngineerCreep = class LabEngineerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        if (creep.memory.status === "awaitingJob") {
            if (Object.entries(creep.room.memory.queues.labQueue).length > 0) {
                this.assignLabJob(creep);
            }
            else {
                this.deassignLabJob(creep);
            }
        }
        if (creep.memory.status !== "awaitingJob") {
            if (creep.memory.labJobUUID) {
                const nextJobParameters = creep.room.memory.queues.labQueue[creep.memory.labJobUUID];
                if (nextJobParameters) {
                    // Mux LabJobs
                    switch (nextJobParameters.labJobType) {
                        case "feedLabEnergy":
                            this.runFeedLabEnergyJob(creep);
                            break;
                        case "feedLabXGH20":
                            this.runFeedLabXGH20Job(creep);
                            break;
                        default:
                            Log.Alert(
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            `LabEngineer ${creep.name} in room ${creep.room.name} cannot understand the labJobType: ${nextJobParameters.labJobType}`);
                            break;
                    }
                }
                else {
                    this.deassignLabJob(creep);
                }
            }
        }
    }
    assignLabJob(creep) {
        const labJobs = Object.entries(creep.room.memory.queues.labQueue);
        const nextLabJobUUID = labJobs.sort(([, labJobMemoryA], [, labJobMemoryB]) => labJobMemoryA.priority - labJobMemoryB.priority)[0][0];
        creep.memory.labJobUUID = nextLabJobUUID;
        creep.memory.status = "working";
    }
    deassignLabJob(creep) {
        delete creep.memory.labJobUUID;
        creep.memory.status = "awaitingJob";
    }
    runFeedLabEnergyJob(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            this.fetchSource(creep, true);
        }
        else if (creep.memory.status === "working") {
            if (creep.memory.labJobUUID) {
                const lab = Game.getObjectById(creep.room.memory.queues.labQueue[creep.memory.labJobUUID].labId);
                if (lab) {
                    this.depositResource(creep, lab, RESOURCE_ENERGY);
                }
            }
        }
    }
    runFeedLabXGH20Job(creep) {
        this.checkIfFull(creep, RESOURCE_CATALYZED_GHODIUM_ACID);
        if (creep.memory.status === "fetchingResource") {
            if (creep.room.terminal) {
                this.withdrawResource(creep, creep.room.terminal, RESOURCE_CATALYZED_GHODIUM_ACID);
            }
        }
        else if (creep.memory.status === "working") {
            if (creep.memory.labJobUUID) {
                const lab = Game.getObjectById(creep.room.memory.queues.labQueue[creep.memory.labJobUUID].labId);
                if (lab) {
                    this.depositResource(creep, lab, RESOURCE_CATALYZED_GHODIUM_ACID);
                }
            }
        }
    }
};
LabEngineerCreep = __decorate([
    profile
], LabEngineerCreep);

let LootResourceCreep = class LootResourceCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            const resourceArray = [];
            Object.entries(creep.room.memory.monitoring.droppedResources).forEach(([resourceIdString]) => {
                const resourceId = resourceIdString;
                const resource = Game.getObjectById(resourceId);
                if (resource) {
                    resourceArray.push(resource);
                }
            });
            const nearestResource = creep.pos.findClosestByPath(resourceArray);
            if (nearestResource) {
                this.pickupResource(creep, nearestResource);
            }
        }
        else if (creep.memory.status === "working") {
            if (creep.room.memory.monitoring.structures.storage) {
                const storage = Game.getObjectById(creep.room.memory.monitoring.structures.storage.id);
                if (storage) {
                    Object.entries(creep.store).forEach(([resourceConstantString]) => {
                        const resourceConstant = resourceConstantString;
                        this.depositResource(creep, storage, resourceConstant);
                    });
                }
            }
        }
    }
};
LootResourceCreep = __decorate([
    profile
], LootResourceCreep);

let ReserveRoomCreep = class ReserveRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.checkIfRecyclable(creep);
        if (creep.memory.status !== "recyclingCreep") {
            this.moveHome(creep);
        }
        if (creep.memory.status === "working") {
            if (Memory.rooms[creep.memory.room].monitoring.structures.controller) {
                const controllerToReserveMemory = Memory.rooms[creep.memory.room].monitoring.structures.controller;
                if (controllerToReserveMemory) {
                    const controllerToReserveId = controllerToReserveMemory.id;
                    if (controllerToReserveId) {
                        const controllerToReserve = Game.getObjectById(controllerToReserveId);
                        if (controllerToReserve) {
                            const reserveResult = creep.reserveController(controllerToReserve);
                            if (reserveResult === ERR_NOT_IN_RANGE) {
                                this.moveCreep(creep, controllerToReserve.pos);
                            }
                            else if (reserveResult === ERR_INVALID_TARGET) {
                                const attackControllerResult = creep.attackController(controllerToReserve);
                                if (attackControllerResult === ERR_NOT_IN_RANGE) {
                                    this.moveCreep(creep, controllerToReserve.pos);
                                }
                                else {
                                    Log.Warning(`Attack Controller Result for ${creep.name} in ${creep.pos.roomName}: ${attackControllerResult}`);
                                }
                            }
                            else if (reserveResult !== OK) {
                                Log.Warning(`Reserve Result for ${creep.name} in ${creep.pos.roomName}: ${reserveResult}`);
                            }
                        }
                    }
                }
            }
        }
    }
    checkIfRecyclable(creep) {
        if (Memory.rooms[creep.memory.room].monitoring.structures.controller) {
            const controllerToReserveMemory = Memory.rooms[creep.memory.room].monitoring.structures.controller;
            if (controllerToReserveMemory) {
                const controllerToReserveId = controllerToReserveMemory.id;
                if (controllerToReserveId) {
                    const controllerToReserve = Game.getObjectById(controllerToReserveId);
                    if (controllerToReserve) {
                        if (creep.ticksToLive && controllerToReserve.upgradeBlocked) {
                            if (creep.ticksToLive < controllerToReserve.upgradeBlocked) {
                                creep.memory.status = "recyclingCreep";
                            }
                        }
                    }
                }
            }
        }
    }
};
ReserveRoomCreep = __decorate([
    profile
], ReserveRoomCreep);

let ScoutRoomCreep = class ScoutRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.moveHome(creep);
        if (creep.memory.status === "working") {
            this.moveCreep(creep, findPath.findClearTerrain(creep.memory.room));
        }
    }
};
ScoutRoomCreep = __decorate([
    profile
], ScoutRoomCreep);

let SourceMinerCreep = class SourceMinerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.moveHome(creep);
        if (creep.memory.status === "fetchingResource" || creep.memory.status === "working") {
            if (creep.memory.sourceId) {
                this.checkIfFull(creep, RESOURCE_ENERGY);
                if (creep.memory.status === "fetchingResource") {
                    const source = Game.getObjectById(creep.memory.sourceId);
                    if (source) {
                        this.harvestSource(creep, source);
                    }
                }
                else if (creep.memory.status === "working") {
                    let dropEnergy = false;
                    if (creep.room.memory.monitoring.structures.storage) {
                        const storage = Game.getObjectById(creep.room.memory.monitoring.structures.storage.id);
                        if (storage) {
                            dropEnergy = false;
                        }
                        else
                            dropEnergy = true;
                    }
                    else
                        dropEnergy = true;
                    if (dropEnergy === true) {
                        creep.drop(RESOURCE_ENERGY);
                    }
                    else if (creep.room.memory.monitoring.structures.storage) {
                        const storage = Game.getObjectById(creep.room.memory.monitoring.structures.storage.id);
                        if (storage) {
                            this.depositResource(creep, storage, RESOURCE_ENERGY);
                        }
                    }
                }
            }
        }
    }
};
SourceMinerCreep = __decorate([
    profile
], SourceMinerCreep);

let TankRoomCreep = class TankRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.moveHome(creep);
        if (creep.memory.status === "working") {
            this.moveCreep(creep, findPath.findClearTerrain(creep.memory.room));
        }
    }
};
TankRoomCreep = __decorate([
    profile
], TankRoomCreep);

let TerminalEngineerCreep = class TerminalEngineerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        if (creep.memory.status === "awaitingJob") {
            if (Object.entries(creep.room.memory.queues.terminalQueue).length > 0) {
                this.assignTerminalJob(creep);
            }
            else {
                this.deassignTerminalJob(creep);
            }
        }
        if (creep.memory.status !== "awaitingJob") {
            if (creep.memory.terminalJobUUID) {
                const nextJobParameters = creep.room.memory.queues.terminalQueue[creep.memory.terminalJobUUID];
                if (nextJobParameters) {
                    // Mux TerminalJobs
                    switch (nextJobParameters.terminalJobType) {
                        case "feedTerminalEnergy":
                            this.runFeedTerminalEnergyJob(creep);
                            break;
                        default:
                            Log.Alert(
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            `TerminalEngineer ${creep.name} in room ${creep.room.name} cannot understand the terminalJobType: ${nextJobParameters.terminalJobType}`);
                            break;
                    }
                }
                else {
                    this.deassignTerminalJob(creep);
                }
            }
        }
    }
    assignTerminalJob(creep) {
        const terminalJobs = Object.entries(creep.room.memory.queues.terminalQueue);
        const nextTerminalJobUUID = terminalJobs.sort(([, terminalJobMemoryA], [, terminalJobMemoryB]) => terminalJobMemoryA.priority - terminalJobMemoryB.priority)[0][0];
        creep.memory.terminalJobUUID = nextTerminalJobUUID;
        creep.memory.status = "working";
    }
    deassignTerminalJob(creep) {
        delete creep.memory.terminalJobUUID;
        creep.memory.status = "awaitingJob";
    }
    runFeedTerminalEnergyJob(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            this.fetchSource(creep, true);
        }
        else if (creep.memory.status === "working") {
            if (creep.room.terminal) {
                this.depositResource(creep, creep.room.terminal, RESOURCE_ENERGY);
            }
        }
    }
};
TerminalEngineerCreep = __decorate([
    profile
], TerminalEngineerCreep);

let TransportResourceCreep = class TransportResourceCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
        if (creep.memory.status === "fetchingResource") {
            if (creep.pos.roomName !== creep.memory.room) {
                this.moveHome(creep);
                creep.memory.status = "fetchingResource";
            }
            else {
                const resourceArray = [];
                Object.entries(creep.room.memory.monitoring.droppedResources)
                    .filter(([, resourceMemory]) => resourceMemory.resourceType === creep.memory.resourceType)
                    .forEach(([resourceIdString]) => {
                    const resourceId = resourceIdString;
                    const resource = Game.getObjectById(resourceId);
                    if (resource) {
                        resourceArray.push(resource);
                    }
                });
                const nearestResource = creep.pos.findClosestByPath(resourceArray);
                if (nearestResource) {
                    this.pickupResource(creep, nearestResource);
                }
            }
        }
        else if (creep.memory.status === "working") {
            if (creep.memory.storage) {
                const storage = Game.getObjectById(creep.memory.storage);
                if (storage) {
                    Object.entries(creep.store).forEach(([resourceConstantString]) => {
                        const resourceConstant = resourceConstantString;
                        this.depositResource(creep, storage, resourceConstant);
                    });
                }
            }
        }
    }
};
TransportResourceCreep = __decorate([
    profile
], TransportResourceCreep);

let UpgradeControllerCreep = class UpgradeControllerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.boostBodyParts(creep, WORK, RESOURCE_CATALYZED_GHODIUM_ACID);
        this.moveHome(creep);
        if (creep.memory.status === "working" || creep.memory.status === "fetchingResource") {
            this.checkIfFull(creep, RESOURCE_ENERGY);
        }
        if (creep.memory.status === "fetchingResource") {
            this.fetchSource(creep);
        }
        else {
            if (creep.memory.status === "working") {
                const controllerId = creep.memory.controllerId;
                if (controllerId) {
                    const controller = Game.getObjectById(controllerId);
                    if (controller) {
                        this.upgradeController(creep, controller);
                    }
                }
            }
        }
    }
    upgradeController(creep, controller) {
        const upgradeResult = creep.upgradeController(controller);
        if (upgradeResult === ERR_NOT_IN_RANGE) {
            const moveResult = this.moveCreep(creep, controller.pos);
            return moveResult;
        }
        else {
            return upgradeResult;
        }
    }
};
UpgradeControllerCreep = __decorate([
    profile
], UpgradeControllerCreep);

class CreepOperator {
    constructor() {
        Object.entries(Game.creeps).forEach(([, creepToOperate]) => {
            switch (creepToOperate.memory.jobType) {
                case "mineSource":
                    new SourceMinerCreep(creepToOperate);
                    break;
                case "feedSpawn":
                    new FeedSpawnCreep(creepToOperate);
                    break;
                case "feedTower":
                    new FeedTowerCreep(creepToOperate);
                    break;
                case "feedLink":
                    new FeedLinkCreep(creepToOperate);
                    break;
                case "upgradeController":
                    new UpgradeControllerCreep(creepToOperate);
                    break;
                case "buildConstructionSite":
                    new BuildConstructionSiteCreep(creepToOperate);
                    break;
                case "lootResource":
                    new LootResourceCreep(creepToOperate);
                    break;
                case "transportResource":
                    new TransportResourceCreep(creepToOperate);
                    break;
                case "scoutRoom":
                    new ScoutRoomCreep(creepToOperate);
                    break;
                case "tankRoom":
                    new TankRoomCreep(creepToOperate);
                    break;
                case "claimRoom":
                    new ClaimRoomCreep(creepToOperate);
                    break;
                case "defendRoom":
                    new DefendRoomCreep(creepToOperate);
                    break;
                case "reserveRoom":
                    new ReserveRoomCreep(creepToOperate);
                    break;
                case "terminalEngineer":
                    new TerminalEngineerCreep(creepToOperate);
                    break;
                case "labEngineer":
                    new LabEngineerCreep(creepToOperate);
                    break;
                case "factoryEngineer":
                    new FactoryEngineerCreep(creepToOperate);
                    break;
                case "dismantleEnemyBuildings":
                    new DismantleEnemyBuildingsCreep(creepToOperate);
                    break;
                default:
                    Log.Alert(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `${creepToOperate.memory.jobType} registered on ${creepToOperate.name} in ${creepToOperate.room.name} does not correspond with any valid jobTypes`);
            }
        });
    }
}

class FactoryEngineerJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.factoryId}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.factoryId}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "FactoryEngineerJob" for Factory ID: "${this.JobParameters.factoryId}" with the UUID "${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "awaitingJob",
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "factoryEngineer",
                    factoryId: this.JobParameters.factoryId
                },
                index,
                room: this.JobParameters.room,
                jobType: "factoryEngineer",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "FactoryEngineerJob" for Factory ID: "${this.JobParameters.factoryId}" with the UUID "${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let FactoryOperator = class FactoryOperator {
    constructor() {
        if (Memory.rooms) {
            Object.entries(Memory.rooms).forEach(([roomName]) => {
                if (Memory.rooms[roomName]) {
                    const factoryMemory = Memory.rooms[roomName].monitoring.structures.factory;
                    if (factoryMemory) {
                        const factory = Game.getObjectById(factoryMemory.id);
                        if (factory) {
                            if (factory.my) {
                                this.manageFactoryJobs(factory);
                                this.maintainFactoryEngineerJobs(factory);
                            }
                        }
                    }
                }
            });
        }
    }
    manageFactoryJobs(factory) {
        if (factory.store[RESOURCE_ENERGY] < FACTORY_CAPACITY / 10 && factory.store.getCapacity(RESOURCE_ENERGY) > 0) {
            this.createFeedFactoryEnergyJob(factory);
        }
        else {
            this.destroyFeedFactoryEnergyJob(factory);
        }
    }
    createFeedFactoryEnergyJob(factory) {
        const factoryJobName = "feedFactoryEnergy";
        const factoryJobUuid = base64.encode(`${factory.id}-${factoryJobName}`);
        if (factory.room.memory.queues.factoryQueue) {
            factory.room.memory.queues.factoryQueue[factoryJobUuid] = {
                factoryJobType: "feedFactoryEnergy",
                priority: 1
            };
        }
    }
    destroyFeedFactoryEnergyJob(factory) {
        const factoryJobName = "feedFactoryEnergy";
        const factoryJobUuid = base64.encode(`${factory.id}-${factoryJobName}`);
        if (factory.room.memory.queues.factoryQueue) {
            if (factory.room.memory.queues.factoryQueue[factoryJobUuid]) {
                delete factory.room.memory.queues.factoryQueue[factoryJobUuid];
            }
        }
    }
    maintainFactoryEngineerJobs(factory) {
        if (factory) {
            const jobParameters = {
                room: factory.pos.roomName,
                status: "awaitingJob",
                jobType: "factoryEngineer",
                factoryId: factory.id
            };
            let count = creepNumbers[jobParameters.jobType];
            const factoryJobs = Object.entries(factory.room.memory.queues.factoryQueue);
            if (factoryJobs.length === 0) {
                count = 0;
            }
            new FactoryEngineerJob(jobParameters, count);
        }
    }
};
FactoryOperator = __decorate([
    profile
], FactoryOperator);

let GameOperator = class GameOperator {
    constructor() {
        this.generatePixel();
    }
    generatePixel() {
        if (Game.cpu) {
            if (Game.cpu.generatePixel && Game.cpu.bucket === 10000) {
                Game.cpu.generatePixel();
            }
        }
    }
};
GameOperator = __decorate([
    profile
], GameOperator);

class LabEngineerJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "LabEngineerJob" for Room: "${this.JobParameters.room}" with the UUID "${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "awaitingJob",
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "labEngineer"
                },
                index,
                room: this.JobParameters.room,
                jobType: "labEngineer",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "LabEngineerJob" for Room: "${this.JobParameters.room}" with the UUID "${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

const labConfiguration = {
    W56N12: {
        boostLab: "63a1e52f46d2f61382721fbf"
    }
};

let LabOperator = class LabOperator {
    constructor() {
        if (Memory.rooms) {
            Object.entries(Memory.rooms).forEach(([roomName]) => {
                Object.entries(Memory.rooms[roomName].monitoring.structures.labs).forEach(([labIdString]) => {
                    const labId = labIdString;
                    const lab = Game.getObjectById(labId);
                    if (lab) {
                        if (lab.my) {
                            this.manageLabJobs(lab);
                        }
                    }
                });
                this.maintainLabEngineerJobs(roomName);
            });
        }
    }
    manageLabJobs(lab) {
        var _a;
        if (lab.store[RESOURCE_ENERGY] < LAB_ENERGY_CAPACITY) {
            this.createFeedLabEnergyJob(lab);
        }
        else {
            this.destroyFeedLabEnergyJob(lab);
        }
        if (labConfiguration[lab.pos.roomName]) {
            if (lab.id === labConfiguration[lab.pos.roomName].boostLab) {
                if (lab.room.terminal) {
                    if (((_a = lab.room.terminal) === null || _a === void 0 ? void 0 : _a.store[RESOURCE_CATALYZED_GHODIUM_ACID]) > 0 &&
                        lab.store.getFreeCapacity(RESOURCE_CATALYZED_GHODIUM_ACID) > 0) {
                        this.createFeedLabXGH20Job(lab);
                    }
                    else {
                        this.destroyFeedLabXGH20Job(lab);
                    }
                }
            }
        }
    }
    createFeedLabEnergyJob(lab) {
        const labJobName = "feedLabEnergy";
        const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);
        if (lab.room.memory.queues.labQueue) {
            lab.room.memory.queues.labQueue[labJobUuid] = {
                labId: lab.id,
                labJobType: "feedLabEnergy",
                priority: 1
            };
        }
    }
    destroyFeedLabEnergyJob(lab) {
        const labJobName = "feedLabEnergy";
        const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);
        if (lab.room.memory.queues.labQueue) {
            if (lab.room.memory.queues.labQueue[labJobUuid]) {
                delete lab.room.memory.queues.labQueue[labJobUuid];
            }
        }
    }
    createFeedLabXGH20Job(lab) {
        const labJobName = "feedLabXGH20";
        const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);
        if (lab.room.memory.queues.labQueue) {
            lab.room.memory.queues.labQueue[labJobUuid] = {
                labId: lab.id,
                labJobType: "feedLabXGH20",
                priority: 2
            };
        }
    }
    destroyFeedLabXGH20Job(lab) {
        const labJobName = "feedLabXGH20";
        const labJobUuid = base64.encode(`${lab.id}-${labJobName}`);
        if (lab.room.memory.queues.labQueue) {
            if (lab.room.memory.queues.labQueue[labJobUuid]) {
                delete lab.room.memory.queues.labQueue[labJobUuid];
            }
        }
    }
    maintainLabEngineerJobs(roomName) {
        if (Object.entries(Memory.rooms[roomName].monitoring.structures.labs).length > 0) {
            const jobParameters = {
                room: roomName,
                status: "awaitingJob",
                jobType: "labEngineer"
            };
            let count = creepNumbers[jobParameters.jobType];
            const labJobs = Object.entries(Memory.rooms[roomName].queues.labQueue);
            if (labJobs.length === 0) {
                count = 0;
            }
            new LabEngineerJob(jobParameters, count);
        }
    }
};
LabOperator = __decorate([
    profile
], LabOperator);

class FeedLinkJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.linkId}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.linkId}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "FeedLinkJob" for Link ID "${this.JobParameters.linkId} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    room: this.JobParameters.room,
                    jobType: "feedLink",
                    linkId: this.JobParameters.linkId
                },
                index,
                room: this.JobParameters.room,
                jobType: "feedLink",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "FeedLinkJob" for Link ID "${this.JobParameters.linkId} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let LinkOperator = class LinkOperator {
    constructor() {
        this.operateLinks();
    }
    operateLinks() {
        Object.entries(Memory.rooms).forEach(([roomName]) => {
            if (Memory.rooms[roomName].monitoring.structures.links) {
                Object.entries(Memory.rooms[roomName].monitoring.structures.links).forEach(([linkIdString]) => {
                    const linkId = linkIdString;
                    const link = Game.getObjectById(linkId);
                    const linkMode = Memory.rooms[roomName].monitoring.structures.links[linkId].mode;
                    if (linkMode === "tx" && link) {
                        if (link.my) {
                            this.createLinkFeederJob(link);
                            this.transmitEnergy(link);
                        }
                    }
                });
            }
        });
    }
    transmitEnergy(txLink) {
        if (txLink.store[RESOURCE_ENERGY] === txLink.store.getCapacity(RESOURCE_ENERGY)) {
            if (txLink.cooldown === 0) {
                const linkIdsThatCanRecieveEnergy = Object.entries(Memory.rooms[txLink.pos.roomName].monitoring.structures.links)
                    .filter(([, linkMonitorMemory]) => linkMonitorMemory.mode === "rx" &&
                    linkMonitorMemory.energy.energyAvailable < linkMonitorMemory.energy.energyCapacity)
                    .sort(([, linkMonitorMemoryA], [, linkMonitorMemoryB]) => linkMonitorMemoryA.energy.energyAvailable - linkMonitorMemoryB.energy.energyAvailable);
                if (linkIdsThatCanRecieveEnergy.length > 0) {
                    const destinationLinkId = linkIdsThatCanRecieveEnergy[0][0];
                    const destinationLink = Game.getObjectById(destinationLinkId);
                    if (destinationLink) {
                        const transmissionResult = txLink.transferEnergy(destinationLink);
                        Log.Debug(`${txLink.id} attempted to transmit energy to ${destinationLink.id}, result: ${transmissionResult} `);
                    }
                }
            }
        }
    }
    createLinkFeederJob(link) {
        const jobParameters = {
            status: "fetchingResource",
            room: link.room.name,
            jobType: "feedLink",
            linkId: link.id
        };
        const count = creepNumbers[jobParameters.jobType];
        new FeedLinkJob(jobParameters, count);
    }
};
LinkOperator = __decorate([
    profile
], LinkOperator);

const creepBodyParts = {
    // First level of nesting, calculated by energyCapacityAvailable, grouped by their RCL maximums.
    1: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, MOVE, CARRY],
        workTerminal: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        feedSpawn: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        factoryEngineer: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        terminalEngineer: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        labEngineer: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        transportResource: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        feedTower: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        feedLink: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        upgradeController: [WORK, WORK, CARRY, MOVE],
        buildConstructionSite: [WORK, WORK, CARRY, MOVE],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [MOVE, MOVE, ATTACK, ATTACK],
        tankRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [MOVE],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM]
    },
    2: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY],
        workTerminal: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedSpawn: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        factoryEngineer: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        terminalEngineer: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        labEngineer: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        transportResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        upgradeController: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        buildConstructionSite: [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, MOVE],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK],
        tankRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [MOVE],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM]
    },
    3: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY],
        workTerminal: [
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
            MOVE
        ],
        feedSpawn: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        factoryEngineer: [
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
            MOVE
        ],
        terminalEngineer: [
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
            MOVE
        ],
        labEngineer: [
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
            MOVE
        ],
        transportResource: [
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
            MOVE
        ],
        feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        upgradeController: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        buildConstructionSite: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
        tankRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [MOVE],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM]
    },
    4: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
        workTerminal: [
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
        factoryEngineer: [
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
        terminalEngineer: [
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
        labEngineer: [
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
        transportResource: [
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
        feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
        ],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [
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
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK
        ],
        tankRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [MOVE],
        reserveRoom: [MOVE, MOVE, CLAIM, CLAIM]
    },
    5: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
        workTerminal: [
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
        factoryEngineer: [
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
        terminalEngineer: [
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
        labEngineer: [
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
        transportResource: [
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
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
        ],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            HEAL,
            HEAL,
            HEAL,
            HEAL
        ],
        tankRoom: [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE
        ],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [MOVE],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM]
    },
    6: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
        workTerminal: [
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
        factoryEngineer: [
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
        terminalEngineer: [
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
        labEngineer: [
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
        transportResource: [
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
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
        ],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [
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
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL
        ],
        tankRoom: [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE
        ],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [MOVE],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM]
    },
    7: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
        workTerminal: [
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
        factoryEngineer: [
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
        terminalEngineer: [
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
        labEngineer: [
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
        transportResource: [
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
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
        ],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [
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
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL
        ],
        tankRoom: [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE
        ],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [
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
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK
        ],
        reserveRoom: [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM
        ]
    },
    8: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
        workTerminal: [
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
        factoryEngineer: [
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
        terminalEngineer: [
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
        labEngineer: [
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
        transportResource: [
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
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
        ],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        defendRoom: [
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
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            ATTACK,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL,
            HEAL
        ],
        tankRoom: [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            TOUGH,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE
        ],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        dismantleEnemyBuildings: [
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
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK
        ],
        reserveRoom: [
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM,
            CLAIM
        ]
    }
};

function fetchBodyParts(creepType, roomName) {
    if (Game.rooms[roomName]) {
        const room = Game.rooms[roomName];
        const energyAvailableHistory = [];
        Object.entries(Memory.rooms[roomName].monitoring.energy.history).forEach(([monitorTimeString]) => {
            const monitorTimeUnknown = monitorTimeString;
            const monitorTime = monitorTimeUnknown;
            energyAvailableHistory.push(Memory.rooms[roomName].monitoring.energy.history[monitorTime].energyAvailable);
        });
        const highestObservedEnergyAvailable = Math.max(...energyAvailableHistory);
        const lowestObservedEnergyAvailable = Math.min(...energyAvailableHistory);
        const avgObservedEnergyAvailable = energyAvailableHistory.reduce((runningTotal, currentNumber) => {
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
        }
        else {
            // RCL 2 START
            if (room.energyCapacityAvailable >= 550 && room.energyCapacityAvailable < 800) {
                if (highestObservedEnergyAvailable >= 550) {
                    // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                    return creepBodyParts[2][creepType];
                }
                else {
                    // Return RCL1 Creep otherwise
                    return creepBodyParts[1][creepType];
                }
            }
            else {
                // RCL 3 START
                if (room.energyCapacityAvailable >= 800 && room.energyCapacityAvailable < 1300) {
                    if (highestObservedEnergyAvailable >= 800) {
                        // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                        return creepBodyParts[3][creepType];
                    }
                    else if (highestObservedEnergyAvailable >= 550) {
                        // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                        return creepBodyParts[2][creepType];
                    }
                    else {
                        // Return RCL1 Creep iotherwise
                        return creepBodyParts[1][creepType];
                    }
                }
                else {
                    // RCL 4 START
                    if (room.energyCapacityAvailable >= 1300 && room.energyCapacityAvailable < 1800) {
                        if (highestObservedEnergyAvailable >= 1300) {
                            // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                            return creepBodyParts[4][creepType];
                        }
                        else if (highestObservedEnergyAvailable >= 800) {
                            // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                            return creepBodyParts[3][creepType];
                        }
                        else if (highestObservedEnergyAvailable >= 550) {
                            // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                            return creepBodyParts[2][creepType];
                        }
                        else {
                            // Return RCL1 Creep otherwise
                            return creepBodyParts[1][creepType];
                        }
                    }
                    else {
                        // RCL 5 START
                        if (room.energyCapacityAvailable >= 1800 && room.energyCapacityAvailable < 2300) {
                            if (highestObservedEnergyAvailable >= 1800) {
                                // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                                return creepBodyParts[5][creepType];
                            }
                            else if (highestObservedEnergyAvailable >= 1300) {
                                // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                                return creepBodyParts[4][creepType];
                            }
                            else if (highestObservedEnergyAvailable >= 800) {
                                // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                                return creepBodyParts[3][creepType];
                            }
                            else if (highestObservedEnergyAvailable >= 550) {
                                // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                                return creepBodyParts[2][creepType];
                            }
                            else {
                                // Return RCL1 Creep otherwise
                                return creepBodyParts[1][creepType];
                            }
                        }
                        else {
                            // RCL 6 START
                            if (room.energyCapacityAvailable >= 2300 && room.energyCapacityAvailable < 5600) {
                                if (highestObservedEnergyAvailable >= 2300) {
                                    // Return RCL6 Creep if highestObservedEnergyAvailable is above 2300
                                    return creepBodyParts[6][creepType];
                                }
                                else if (highestObservedEnergyAvailable >= 1800) {
                                    // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                                    return creepBodyParts[5][creepType];
                                }
                                else if (highestObservedEnergyAvailable >= 1300) {
                                    // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                                    return creepBodyParts[4][creepType];
                                }
                                else if (highestObservedEnergyAvailable >= 800) {
                                    // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                                    return creepBodyParts[3][creepType];
                                }
                                else if (highestObservedEnergyAvailable >= 550) {
                                    // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                                    return creepBodyParts[2][creepType];
                                }
                                else {
                                    // Return RCL1 Creep otherwise
                                    return creepBodyParts[1][creepType];
                                }
                            }
                            else {
                                // RCL 7 START
                                if (room.energyCapacityAvailable >= 5600 && room.energyCapacityAvailable < 12900) {
                                    if (highestObservedEnergyAvailable >= 5600) {
                                        // Return RCL7 Creep if highestObservedEnergyAvailable is above 5600
                                        return creepBodyParts[7][creepType];
                                    }
                                    else if (highestObservedEnergyAvailable >= 2300) {
                                        // Return RCL6 Creep if highestObservedEnergyAvailable is above 2300
                                        return creepBodyParts[6][creepType];
                                    }
                                    else if (highestObservedEnergyAvailable >= 1800) {
                                        // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                                        return creepBodyParts[5][creepType];
                                    }
                                    else if (highestObservedEnergyAvailable >= 1300) {
                                        // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                                        return creepBodyParts[4][creepType];
                                    }
                                    else if (highestObservedEnergyAvailable >= 800) {
                                        // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                                        return creepBodyParts[3][creepType];
                                    }
                                    else if (highestObservedEnergyAvailable >= 550) {
                                        // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                                        return creepBodyParts[2][creepType];
                                    }
                                    else {
                                        // Return RCL1 Creep otherwise
                                        return creepBodyParts[1][creepType];
                                    }
                                }
                                else {
                                    // RCL 8 START
                                    if (room.energyCapacityAvailable >= 12900) {
                                        if (highestObservedEnergyAvailable >= 12900) {
                                            // Return RCL8 Creep if highestObservedEnergyAvailable is above 12900
                                            return creepBodyParts[8][creepType];
                                        }
                                        else if (highestObservedEnergyAvailable >= 5600) {
                                            // Return RCL7 Creep if highestObservedEnergyAvailable is above 5600
                                            return creepBodyParts[7][creepType];
                                        }
                                        else if (highestObservedEnergyAvailable >= 2300) {
                                            // Return RCL6 Creep if highestObservedEnergyAvailable is above 2300
                                            return creepBodyParts[6][creepType];
                                        }
                                        else if (highestObservedEnergyAvailable >= 1800) {
                                            // Return RCL5 Creep if highestObservedEnergyAvailable is above 1800
                                            return creepBodyParts[5][creepType];
                                        }
                                        else if (highestObservedEnergyAvailable >= 1300) {
                                            // Return RCL4 Creep if highestObservedEnergyAvailable is above 1300
                                            return creepBodyParts[4][creepType];
                                        }
                                        else if (highestObservedEnergyAvailable >= 800) {
                                            // Return RCL3 Creep if highestObservedEnergyAvailable is above 800
                                            return creepBodyParts[3][creepType];
                                        }
                                        else if (highestObservedEnergyAvailable >= 550) {
                                            // Return RCL2 Creep if highestObservedEnergyAvailable is above 550
                                            return creepBodyParts[2][creepType];
                                        }
                                        else {
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

let JobQueueOperator = class JobQueueOperator {
    constructor() {
        this.processJobs();
    }
    processJobs() {
        for (const jobUUID in Memory.queues.jobQueue) {
            let spawnRoom = Memory.queues.jobQueue[jobUUID].jobParameters.room;
            if (Memory.queues.jobQueue[jobUUID].jobParameters.spawnRoom) {
                const spawnRoomString = Memory.queues.jobQueue[jobUUID].jobParameters.spawnRoom;
                if (spawnRoomString) {
                    spawnRoom = spawnRoomString;
                }
            }
            const desiredBodyParts = fetchBodyParts(Memory.queues.jobQueue[jobUUID].jobType, spawnRoom);
            // console.log(`${Memory.queues.jobQueue[jobUUID].jobType}: ${desiredBodyParts.toString()}`);
            if (!Memory.queues.spawnQueue[jobUUID]) {
                if (!this.checkCreep(jobUUID)) {
                    Memory.queues.spawnQueue[jobUUID] = {
                        name: jobUUID,
                        uuid: jobUUID,
                        creepType: Memory.queues.jobQueue[jobUUID].jobType,
                        bodyParts: desiredBodyParts,
                        room: Memory.queues.jobQueue[jobUUID].jobParameters.room,
                        spawnRoom: Memory.queues.jobQueue[jobUUID].jobParameters.spawnRoom,
                        jobParameters: Memory.queues.jobQueue[jobUUID].jobParameters
                    };
                }
                else {
                    if (this.checkCreep(jobUUID)) {
                        delete Memory.queues.spawnQueue[jobUUID];
                        delete Memory.rooms[spawnRoom].queues.spawnQueue[jobUUID];
                    }
                    else {
                        if (Memory.queues.spawnQueue[jobUUID].bodyParts !== desiredBodyParts) {
                            Memory.queues.spawnQueue[jobUUID].bodyParts = desiredBodyParts;
                        }
                    }
                }
            }
            else {
                if (this.checkCreep(jobUUID)) {
                    delete Memory.queues.spawnQueue[jobUUID];
                    delete Memory.rooms[spawnRoom].queues.spawnQueue[jobUUID];
                }
                else {
                    if (Memory.queues.spawnQueue[jobUUID].bodyParts !== desiredBodyParts) {
                        Memory.queues.spawnQueue[jobUUID].bodyParts = desiredBodyParts;
                    }
                }
            }
        }
    }
    checkCreep(UUID) {
        if (Game.creeps[UUID]) {
            return true;
        }
        else {
            return false;
        }
    }
};
JobQueueOperator = __decorate([
    profile
], JobQueueOperator);

function creepPriority(room) {
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
        defendRoom: 12,
        buildConstructionSite: 13,
        terminalEngineer: 14,
        labEngineer: 15,
        factoryEngineer: 16,
        tankRoom: 17,
        dismantleEnemyBuildings: 18
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
                defendRoom: priority.defendRoom,
                buildConstructionSite: priority.buildConstructionSite,
                feedLink: priority.feedLink,
                workTerminal: priority.workTerminal,
                lootResource: priority.lootResource,
                terminalEngineer: priority.terminalEngineer,
                labEngineer: priority.labEngineer,
                factoryEngineer: priority.factoryEngineer,
                tankRoom: priority.tankRoom,
                dismantleEnemyBuildings: priority.dismantleEnemyBuildings
            };
        }
    }
    return priority;
}

let SpawnQueueOperator = class SpawnQueueOperator {
    constructor() {
        this.generateRoomSpawnQueues();
    }
    generateRoomSpawnQueues() {
        const sortedSpawnQueue = Object.entries(Memory.queues.spawnQueue).sort(([, spawnJobA], [, spawnJobB]) => {
            return (creepPriority(Game.rooms[spawnJobA.room])[spawnJobA.creepType] -
                creepPriority(Game.rooms[spawnJobB.room])[spawnJobB.creepType]);
        });
        if (sortedSpawnQueue.length > 0) {
            Object.entries(sortedSpawnQueue).forEach(([, roomSpawnQueue]) => {
                let roomSpawnQueueSpawnRoom = roomSpawnQueue[1].room;
                if (roomSpawnQueue[1].spawnRoom) {
                    roomSpawnQueueSpawnRoom = roomSpawnQueue[1].spawnRoom;
                }
                if (!Memory.rooms[roomSpawnQueueSpawnRoom].queues.spawnQueue) {
                    Memory.rooms[roomSpawnQueueSpawnRoom].queues.spawnQueue = {};
                }
                Memory.rooms[roomSpawnQueueSpawnRoom].queues.spawnQueue[roomSpawnQueue[0]] = roomSpawnQueue[1];
            });
        }
    }
};
SpawnQueueOperator = __decorate([
    profile
], SpawnQueueOperator);

class QueueOperator {
    constructor() {
        this.runQueueOperators();
        this.runSpawnQueueOperator();
    }
    runQueueOperators() {
        this.runJobQueueOperator();
    }
    runJobQueueOperator() {
        new JobQueueOperator();
    }
    runSpawnQueueOperator() {
        new SpawnQueueOperator();
    }
}

class ClaimRoomJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "ClaimRoomJob" for Room ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: this.JobParameters.status,
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "claimRoom"
                },
                index,
                room: this.JobParameters.room,
                jobType: "claimRoom",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "ClaimRoomJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

class ReserveRoomJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "ReserveRoomJob" for Room ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: this.JobParameters.status,
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "reserveRoom"
                },
                index,
                room: this.JobParameters.room,
                jobType: "reserveRoom",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "ReserveRoomJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

class ScoutRoomJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "ScoutRoomJob" for Room ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: this.JobParameters.status,
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "scoutRoom"
                },
                index,
                room: this.JobParameters.room,
                jobType: "scoutRoom",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "ScoutRoomJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

const roomsToClaim = ["W55N12"];

const roomsToMine = ["W56N11", "W55N11"];

const roomOperations = {
    generateRoomsArray(roomOperation) {
        let roomsArray = [];
        if (roomOperation) {
            if (roomOperation === "mine") {
                roomsArray = roomsToMine;
            }
            else {
                if (roomOperation === "claim") {
                    roomsArray = roomsToClaim;
                }
            }
        }
        else {
            roomsArray = roomsArray.concat(roomsToMine);
            roomsArray = roomsArray.concat(roomsToClaim);
            Object.entries(Game.rooms).forEach(([roomName, room]) => {
                let monitorRoom = false;
                if (room) {
                    if (room.controller) {
                        if (room.controller.my) {
                            monitorRoom = true;
                        }
                        if (!room.controller.owner) {
                            monitorRoom = true;
                        }
                    }
                }
                if (monitorRoom === true) {
                    roomsArray.push(roomName);
                }
            });
        }
        return roomsArray;
    }
};

class TankRoomJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "TankRoomJob" for Room ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: this.JobParameters.status,
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "tankRoom"
                },
                index,
                room: this.JobParameters.room,
                jobType: "tankRoom",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "TankRoomJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

const roomsToTank = [];

class DefendRoomJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "DefendRoomJob" for Room ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: this.JobParameters.status,
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "defendRoom"
                },
                index,
                room: this.JobParameters.room,
                jobType: "defendRoom",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "DefendRoomJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

const roomsToDismantleEnemyBuildings = [];

class DismantleEnemyBuildingsJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "DismantleEnemyBuildingsJob" for Room ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: this.JobParameters.status,
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "dismantleEnemyBuildings"
                },
                index,
                room: this.JobParameters.room,
                jobType: "dismantleEnemyBuildings",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "DismantleEnemyBuildingsJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let RoomOperator = class RoomOperator {
    constructor() {
        this.maintainTankRoomJobs();
        this.maintainDismantleEnemyBuildingsJobs();
        const roomsToOperate = roomOperations.generateRoomsArray();
        roomsToOperate.forEach(roomName => {
            var _a, _b, _c, _d;
            this.maintainDefendRoomJobs(roomName);
            // console.log(`${Game.time.toString()} - ${roomName}`);
            const room = Game.rooms[roomName];
            if (room) {
                const roomController = room.controller;
                if (roomController) {
                    if (roomController.my) ;
                    else {
                        if (roomOperations.generateRoomsArray("claim").includes(roomName)) {
                            this.createClaimRoomJob(roomName);
                        }
                        if (roomOperations.generateRoomsArray("mine").includes(roomName)) {
                            if (!(((_b = (_a = room.controller) === null || _a === void 0 ? void 0 : _a.reservation) === null || _b === void 0 ? void 0 : _b.username) === myScreepsUsername)) {
                                if ((_c = room.controller) === null || _c === void 0 ? void 0 : _c.upgradeBlocked) {
                                    if (((_d = room.controller) === null || _d === void 0 ? void 0 : _d.upgradeBlocked) < 150) {
                                        this.createReserveRoomJob(roomName);
                                    }
                                }
                                else {
                                    this.createReserveRoomJob(roomName);
                                }
                            }
                        }
                    }
                }
            }
            else {
                this.createScoutRoomJob(roomName);
            }
        });
    }
    createScoutRoomJob(roomName) {
        const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
        const jobParameters = {
            jobType: "scoutRoom",
            status: "movingIntoRoom",
            room: roomName,
            spawnRoom
        };
        new ScoutRoomJob(jobParameters);
    }
    maintainTankRoomJobs() {
        roomsToTank.forEach(roomName => {
            const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
            const jobParameters = {
                jobType: "tankRoom",
                status: "movingIntoRoom",
                room: roomName,
                spawnRoom
            };
            new TankRoomJob(jobParameters, creepNumbers[jobParameters.jobType]);
        });
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobQueueEntry]) => jobQueueEntry.jobType === "tankRoom")
            .forEach(([jobQueueUUID, jobQueueEntry]) => {
            if (!roomsToTank.includes(jobQueueEntry.room)) {
                delete Memory.queues.jobQueue[jobQueueUUID];
            }
        });
    }
    maintainDismantleEnemyBuildingsJobs() {
        roomsToDismantleEnemyBuildings.forEach(roomName => {
            const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
            const jobParameters = {
                jobType: "dismantleEnemyBuildings",
                status: "movingIntoRoom",
                room: roomName,
                spawnRoom
            };
            new DismantleEnemyBuildingsJob(jobParameters, creepNumbers[jobParameters.jobType]);
        });
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobQueueEntry]) => jobQueueEntry.jobType === "dismantleEnemyBuildings")
            .forEach(([jobQueueUUID, jobQueueEntry]) => {
            if (!roomsToDismantleEnemyBuildings.includes(jobQueueEntry.room)) {
                delete Memory.queues.jobQueue[jobQueueUUID];
            }
        });
    }
    maintainDefendRoomJobs(roomName) {
        if (Memory.rooms[roomName]) {
            const roomHostileCount = Object.entries(Memory.rooms[roomName].monitoring.hostiles);
            if (roomHostileCount.length > 0) {
                const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
                const jobParameters = {
                    jobType: "defendRoom",
                    status: "movingIntoRoom",
                    room: roomName,
                    spawnRoom
                };
                new DefendRoomJob(jobParameters);
            }
            else {
                Object.entries(Memory.queues.jobQueue)
                    .filter(([, jobQueueEntry]) => jobQueueEntry.jobType === "defendRoom" && jobQueueEntry.room === roomName)
                    .forEach(([jobQueueUUID]) => {
                    delete Memory.queues.jobQueue[jobQueueUUID];
                });
            }
        }
    }
    createClaimRoomJob(roomName) {
        const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
        const jobParameters = {
            jobType: "claimRoom",
            status: "movingIntoRoom",
            room: roomName,
            spawnRoom
        };
        new ClaimRoomJob(jobParameters);
    }
    createReserveRoomJob(roomName) {
        let postponeCreate = false;
        const room = Game.rooms[roomName];
        if (room) {
            if (room.controller) {
                if (room.controller.upgradeBlocked) {
                    if (room.controller.upgradeBlocked > 600) {
                        postponeCreate = true;
                    }
                    if (room.controller.reservation) {
                        if (room.controller.reservation.username === myScreepsUsername) {
                            if (room.controller.reservation.ticksToEnd > 1500) {
                                postponeCreate = true;
                            }
                        }
                    }
                }
            }
        }
        else {
            postponeCreate = true;
        }
        const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
        const jobParameters = {
            jobType: "reserveRoom",
            status: "movingIntoRoom",
            room: roomName,
            spawnRoom
        };
        if (!postponeCreate) {
            new ReserveRoomJob(jobParameters);
        }
        else {
            new ReserveRoomJob(jobParameters, 0);
        }
    }
};
RoomOperator = __decorate([
    profile
], RoomOperator);

class MineSourceJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
            jobMemory.jobParameters.sourceId === this.JobParameters.sourceId)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.sourceId}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.sourceId}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "MineSourceJob" for Source ID: "${this.JobParameters.sourceId}" with the UUID "${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    spawnRoom: this.JobParameters.spawnRoom,
                    room: this.JobParameters.room,
                    jobType: "mineSource",
                    sourceId: this.JobParameters.sourceId
                },
                index,
                room: this.JobParameters.room,
                jobType: "mineSource",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting  "MineSourceJob" for Source ID: "${this.JobParameters.sourceId}" with the UUID "${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

class TransportResourceJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${this.JobParameters.resourceType}-${this.JobParameters.storage}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${this.JobParameters.resourceType}-${this.JobParameters.storage}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "TransportResourceJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "transportResource",
                    resourceType: this.JobParameters.resourceType,
                    storage: this.JobParameters.storage
                },
                index,
                room: this.JobParameters.room,
                jobType: "transportResource",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "LootResourceJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let SourceOperator = class SourceOperator {
    constructor() {
        this.operateSources();
    }
    operateSources() {
        var _a, _b, _c, _d;
        if (Memory.rooms) {
            for (const roomName in Memory.rooms) {
                for (const sourceIdString in Memory.rooms[roomName].monitoring.sources) {
                    const sourceId = sourceIdString;
                    const source = Game.getObjectById(sourceId);
                    if (source) {
                        if (((_a = source.room.controller) === null || _a === void 0 ? void 0 : _a.my) || ((_c = (_b = source.room.controller) === null || _b === void 0 ? void 0 : _b.reservation) === null || _c === void 0 ? void 0 : _c.username) === myScreepsUsername) {
                            this.createSourceMinerJob(source);
                            if (!((_d = source.room.controller) === null || _d === void 0 ? void 0 : _d.my)) {
                                this.createTransportEnergyJob(source);
                            }
                        }
                    }
                }
            }
        }
    }
    createSourceMinerJob(source) {
        let spawnRoom = source.pos.roomName;
        if (Object.entries(source.room.memory.monitoring.structures.spawns).length === 0) {
            spawnRoom = findPath.findClosestSpawnToRoom(source.pos.roomName).pos.roomName;
        }
        const JobParameters = {
            status: "fetchingResource",
            spawnRoom,
            room: source.pos.roomName,
            jobType: "mineSource",
            sourceId: source.id
        };
        const count = creepNumbers[JobParameters.jobType];
        new MineSourceJob(JobParameters, count);
    }
    createTransportEnergyJob(source) {
        const storage = findPath.findClosestStorageToRoom(source.pos.roomName);
        if (storage) {
            const JobParameters = {
                status: "fetchingResource",
                spawnRoom: findPath.findClosestSpawnToRoom(source.pos.roomName).pos.roomName,
                room: source.pos.roomName,
                jobType: "transportResource",
                resourceType: RESOURCE_ENERGY,
                storage: storage.id
            };
            const count = creepNumbers[JobParameters.jobType];
            new TransportResourceJob(JobParameters, count);
        }
        else {
            Log.Alert(`TransportResource Job for source ${source.id} cannot find any storage nearby ${source.pos.roomName}!`);
        }
    }
};
SourceOperator = __decorate([
    profile
], SourceOperator);

class FeedSpawnJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType &&
            jobMemory.jobParameters.room === this.JobParameters.room)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "FeedSpawnJob" for Room "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    room: this.JobParameters.room,
                    jobType: "feedSpawn"
                },
                index,
                room: this.JobParameters.room,
                jobType: "feedSpawn",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "FeedSpawnJob" for Room "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let SpawnOperator = class SpawnOperator {
    constructor() {
        this.createSpawnFeederJobs();
        Object.entries(Memory.rooms).forEach(([roomName]) => {
            this.operateSpawns(roomName);
        });
    }
    operateSpawns(roomName) {
        if (Memory.rooms[roomName].queues.spawnQueue) {
            const sortedRoomSpawnQueue = Object.entries(Memory.rooms[roomName].queues.spawnQueue);
            let spawn = null;
            if (sortedRoomSpawnQueue.length > 0) {
                const nextSpawnJob = sortedRoomSpawnQueue[0][1];
                let spawnRoom = nextSpawnJob.room;
                if (nextSpawnJob.jobParameters.spawnRoom) {
                    const spawnRoomString = nextSpawnJob.spawnRoom;
                    if (spawnRoomString) {
                        spawnRoom = spawnRoomString;
                    }
                }
                const spawnObjects = Object.entries(Game.spawns).filter(([, Spawn]) => Spawn.spawning === null && Spawn.pos.roomName === spawnRoom);
                if (spawnObjects.length > 0) {
                    spawn = spawnObjects[0][1];
                }
                if (spawn) {
                    const spawnResult = spawn.spawnCreep(nextSpawnJob.bodyParts, nextSpawnJob.name, {
                        memory: nextSpawnJob.jobParameters
                    });
                    Log.Debug(`Spawn result for ${nextSpawnJob.creepType} in room ${spawnRoom}: ${spawnResult}`);
                    if (spawnResult === OK) {
                        delete Memory.rooms[spawnRoom].queues.spawnQueue[nextSpawnJob.uuid];
                        delete Memory.queues.spawnQueue[nextSpawnJob.uuid];
                    }
                }
                else {
                    const AllSpawnObjects = Object.entries(Game.spawns).filter(([, Spawn]) => Spawn.pos.roomName === spawnRoom);
                    if (AllSpawnObjects.length < 1) {
                        Log.Emergency("::: !!! ::: Spawn object is null! All spawning currently halted in an error state! ::: !!! :::");
                        Log.Debug(`::: !!! :::  spawnRoom: ${spawnRoom} ::: !!! :::`);
                        Log.Debug(`::: !!! :::  nextSpawnJob Parameters: ${JSON.stringify(nextSpawnJob)} ::: !!! :::`);
                    }
                    else {
                        Log.Warning(`While attempting to spawn a ${nextSpawnJob.jobParameters.jobType} creep, it was discovered that all spawners in ${spawnRoom} are spawning`);
                    }
                }
            }
        }
        else {
            Log.Emergency(`No spawn queue discovered in Memory.rooms[${roomName}].queues.spawnQueues`);
        }
    }
    createSpawnFeederJobs() {
        Object.entries(Game.spawns).forEach(([, spawn]) => {
            const JobParameters = {
                status: "fetchingResource",
                room: spawn.pos.roomName,
                jobType: "feedSpawn"
            };
            const count = creepNumbers[JobParameters.jobType];
            new FeedSpawnJob(JobParameters, count);
        });
    }
};
SpawnOperator = __decorate([
    profile
], SpawnOperator);

class TerminalEngineerJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.terminalId}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.terminalId}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "TerminalEngineerJob" for Terminal ID: "${this.JobParameters.terminalId}" with the UUID "${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "awaitingJob",
                    room: this.JobParameters.room,
                    spawnRoom: this.JobParameters.spawnRoom,
                    jobType: "terminalEngineer",
                    terminalId: this.JobParameters.terminalId
                },
                index,
                room: this.JobParameters.room,
                jobType: "terminalEngineer",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "TerminalEngineerJob" for Terminal ID: "${this.JobParameters.terminalId}" with the UUID "${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let TerminalOperator = class TerminalOperator {
    constructor() {
        if (Memory.rooms) {
            Object.entries(Memory.rooms).forEach(([roomName]) => {
                const room = Game.rooms[roomName];
                if (room) {
                    if (room.terminal) {
                        if (room.terminal.my) {
                            this.manageTerminalJobs(room.terminal);
                            this.maintainTerminalEngineerJobs(room.terminal);
                        }
                    }
                }
            });
        }
    }
    manageTerminalJobs(terminal) {
        if (terminal.store[RESOURCE_ENERGY] < TERMINAL_CAPACITY / 3 && terminal.store.getCapacity(RESOURCE_ENERGY) > 0) {
            this.createFeedTerminalEnergyJob(terminal);
        }
        else {
            this.destroyFeedTerminalEnergyJob(terminal);
        }
    }
    createFeedTerminalEnergyJob(terminal) {
        const terminalJobName = "feedTerminalEnergy";
        const terminalJobUuid = base64.encode(`${terminal.id}-${terminalJobName}`);
        if (terminal.room.memory.queues.terminalQueue) {
            terminal.room.memory.queues.terminalQueue[terminalJobUuid] = {
                terminalJobType: "feedTerminalEnergy",
                priority: 1
            };
        }
    }
    destroyFeedTerminalEnergyJob(terminal) {
        const terminalJobName = "feedTerminalEnergy";
        const terminalJobUuid = base64.encode(`${terminal.id}-${terminalJobName}`);
        if (terminal.room.memory.queues.terminalQueue) {
            if (terminal.room.memory.queues.terminalQueue[terminalJobUuid]) {
                delete terminal.room.memory.queues.terminalQueue[terminalJobUuid];
            }
        }
    }
    maintainTerminalEngineerJobs(terminal) {
        if (terminal) {
            const jobParameters = {
                room: terminal.pos.roomName,
                status: "awaitingJob",
                jobType: "terminalEngineer",
                terminalId: terminal.id
            };
            let count = creepNumbers[jobParameters.jobType];
            const terminalJobs = Object.entries(terminal.room.memory.queues.terminalQueue);
            if (terminalJobs.length === 0) {
                count = 0;
            }
            new TerminalEngineerJob(jobParameters, count);
        }
    }
};
TerminalOperator = __decorate([
    profile
], TerminalOperator);

class FeedTowerJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.towerId}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.towerId}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "FeedTowerJob" for Tower ID "${this.JobParameters.towerId} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    room: this.JobParameters.room,
                    jobType: "feedTower",
                    towerId: this.JobParameters.towerId
                },
                index,
                room: this.JobParameters.room,
                jobType: "feedTower",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "FeedTowerJob" for Tower ID "${this.JobParameters.towerId} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let TowerOperator = class TowerOperator {
    constructor() {
        if (Memory.rooms) {
            Object.entries(Memory.rooms).forEach(([roomName]) => {
                const towersInMemory = Memory.rooms[roomName].monitoring.structures.towers;
                if (towersInMemory) {
                    Object.entries(towersInMemory).forEach(([towerIdString]) => {
                        const towerId = towerIdString;
                        const tower = Game.getObjectById(towerId);
                        if (tower) {
                            if (tower.my) {
                                this.createTowerFeederJob(tower);
                                this.operateTowers(tower);
                            }
                        }
                    });
                }
            });
        }
    }
    createTowerFeederJob(tower) {
        const jobParameters = {
            status: "fetchingResource",
            room: tower.room.name,
            jobType: "feedTower",
            towerId: tower.id
        };
        new FeedTowerJob(jobParameters);
    }
    operateTowers(tower) {
        if (!this.attackHostiles(tower)) {
            this.repairRoads(tower);
        }
    }
    attackHostiles(tower) {
        const hostileCreep = fetchHostileCreep(tower.room);
        if (hostileCreep) {
            const attackResult = tower.attack(hostileCreep);
            console.log(`Attack result on ${hostileCreep.name}: ${attackResult}`);
            if (attackResult === OK) {
                return true;
            }
        }
        return false;
    }
    repairRoads(tower) {
        const roadsInMemory = tower.room.memory.monitoring.structures.roads;
        if (roadsInMemory) {
            const roadToRepairObject = Object.entries(roadsInMemory).sort(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ([, cachedRoadA], [, cachedRoadB]) => cachedRoadA.structure.hits - cachedRoadB.structure.hits);
            if (roadToRepairObject[0]) {
                const roadToRepairId = roadToRepairObject[0][0];
                const roadToRepair = Game.getObjectById(roadToRepairId);
                if (roadToRepair) {
                    tower.repair(roadToRepair);
                }
                else {
                    delete Memory.rooms[tower.pos.roomName].monitoring.structures.roads[roadToRepairId];
                }
            }
        }
    }
};
TowerOperator = __decorate([
    profile
], TowerOperator);

class Operator {
    constructor() {
        this.runOperators();
    }
    runOperators() {
        this.runRoomOperator();
        this.runControllerOperator();
        this.runSourceOperator();
        this.runTowerOperator();
        this.runLinkOperator();
        this.runConstructionSiteOperator();
        this.runQueueOperator();
        this.runSpawnOperator();
        this.runGameOperator();
        this.runTerminalOperator();
        this.runLabOperator();
        this.runFactoryOperator();
        this.runCreepOperator();
    }
    runControllerOperator() {
        new ControllerOperator();
    }
    runSourceOperator() {
        new SourceOperator();
    }
    runQueueOperator() {
        new QueueOperator();
    }
    runSpawnOperator() {
        new SpawnOperator();
    }
    runTowerOperator() {
        new TowerOperator();
    }
    runCreepOperator() {
        new CreepOperator();
    }
    runLinkOperator() {
        new LinkOperator();
    }
    runConstructionSiteOperator() {
        new ConstructionSiteOperator();
    }
    runRoomOperator() {
        new RoomOperator();
    }
    runTerminalOperator() {
        new TerminalOperator();
    }
    runLabOperator() {
        new LabOperator();
    }
    runGameOperator() {
        new GameOperator();
    }
    runFactoryOperator() {
        new FactoryOperator();
    }
}

let ConstructionSiteMonitor = class ConstructionSiteMonitor {
    constructor(room) {
        this.room = room;
        this.initalizeConstructionSiteMonitorMemory();
        this.monitorConstructionSites();
    }
    initalizeConstructionSiteMonitorMemory() {
        if (!this.room.memory.monitoring.constructionSites) {
            this.room.memory.monitoring.constructionSites = {};
        }
    }
    monitorConstructionSites() {
        const constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);
        constructionSites.forEach(constructionSite => {
            this.room.memory.monitoring.constructionSites[constructionSite.id] = {
                progress: constructionSite.progress,
                total: constructionSite.progressTotal
            };
        });
    }
};
ConstructionSiteMonitor = __decorate([
    profile
], ConstructionSiteMonitor);

class LootResourceJob {
    constructor(JobParameters, count = 1) {
        this.JobParameters = JobParameters;
        Object.entries(Memory.queues.jobQueue)
            .filter(([, jobMemory]) => jobMemory.jobParameters.jobType === this.JobParameters.jobType)
            .forEach(([jobUUID, jobMemory]) => {
            if (jobMemory.index > count) {
                this.deleteJob(jobUUID);
            }
        });
        if (count === 1) {
            const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-1`);
            this.createJob(UUID, 1);
        }
        else {
            let iterations = 1;
            while (iterations <= count) {
                const UUID = base64.encode(`${this.JobParameters.jobType}-${this.JobParameters.room}-${iterations}`);
                this.createJob(UUID, iterations);
                iterations++;
            }
        }
    }
    createJob(UUID, index) {
        if (!Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Creating "LootResourceJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            Memory.queues.jobQueue[UUID] = {
                jobParameters: {
                    uuid: UUID,
                    status: "fetchingResource",
                    room: this.JobParameters.room,
                    jobType: "lootResource"
                },
                index,
                room: this.JobParameters.room,
                jobType: "lootResource",
                timeAdded: Game.time
            };
        }
    }
    deleteJob(UUID) {
        if (Memory.queues.jobQueue[UUID]) {
            Log.Informational(`Deleting "LootResourceJob" for Tower ID "${this.JobParameters.room} with the UUID of ${UUID}"`);
            delete Memory.queues.jobQueue[UUID];
        }
    }
}

let DroppedResourceMonitor = class DroppedResourceMonitor {
    constructor(room) {
        this.room = room;
        if (this.room) {
            this.initializeDroppedResourceMonitorMemory();
            this.monitorDroppedResources();
            this.cleanDroppedResources();
            this.createLootResourceJob();
        }
    }
    initializeDroppedResourceMonitorMemory() {
        if (!this.room.memory.monitoring.droppedResources) {
            this.room.memory.monitoring.droppedResources = {};
        }
    }
    monitorDroppedResources() {
        const droppedResources = this.room.find(FIND_DROPPED_RESOURCES);
        droppedResources.forEach(droppedResource => {
            this.room.memory.monitoring.droppedResources[droppedResource.id] = {
                resourceType: droppedResource.resourceType,
                amount: droppedResource.amount
            };
        });
    }
    cleanDroppedResources() {
        Object.entries(this.room.memory.monitoring.droppedResources).forEach(([droppedResourceId]) => {
            const droppedResource = Game.getObjectById(droppedResourceId);
            if (!droppedResource) {
                delete this.room.memory.monitoring.droppedResources[droppedResourceId];
            }
        });
    }
    createLootResourceJob() {
        if (this.room.memory.monitoring.structures.storage) {
            if (Object.entries(this.room.memory.monitoring.droppedResources).length > 0) {
                let spawnRoom = this.room.name;
                if (Object.entries(Memory.rooms[this.room.name].monitoring.structures.spawns).length === 0) {
                    spawnRoom = findPath.findClosestSpawnToRoom(this.room.name).pos.roomName;
                }
                const jobParameters = {
                    room: spawnRoom,
                    status: "fetchingResource",
                    jobType: "lootResource"
                };
                const count = creepNumbers[jobParameters.jobType];
                new LootResourceJob(jobParameters, count);
            }
        }
    }
};
DroppedResourceMonitor = __decorate([
    profile
], DroppedResourceMonitor);

let EnergyMonitor = class EnergyMonitor {
    constructor(room) {
        this.room = room;
        if (this.room) {
            this.initializeEnergyMonitorMemory();
            this.monitorEnergy();
            this.cleanHistory();
        }
    }
    initializeEnergyMonitorMemory() {
        if (!this.room.memory.monitoring.energy) {
            this.room.memory.monitoring.energy = {
                history: {}
            };
        }
    }
    monitorEnergy() {
        this.room.memory.monitoring.energy.history[Game.time] = {
            energyAvailable: this.room.energyAvailable,
            energyCapacity: this.room.energyCapacityAvailable
        };
    }
    cleanHistory() {
        const deleteThreshold = 100;
        const curTime = Game.time;
        Object.entries(this.room.memory.monitoring.energy.history).forEach(([monitorTimeString]) => {
            const monitorTimeUnknown = monitorTimeString;
            const monitorTime = monitorTimeUnknown;
            if (monitorTime < curTime - deleteThreshold) {
                delete this.room.memory.monitoring.energy.history[monitorTime];
            }
        });
    }
};
EnergyMonitor = __decorate([
    profile
], EnergyMonitor);

let HostileMonitor = class HostileMonitor {
    constructor(room) {
        this.room = room;
        this.initalizeHostileMonitorMemory();
        this.cleanHostilesMemory();
        this.monitorHostiles();
    }
    initalizeHostileMonitorMemory() {
        if (!this.room.memory.monitoring.hostiles) {
            this.room.memory.monitoring.hostiles = {};
        }
    }
    cleanHostilesMemory() {
        Object.entries(this.room.memory.monitoring.hostiles).forEach(([hostileIdString]) => {
            const hostileId = hostileIdString;
            const hostile = Game.getObjectById(hostileId);
            if (!hostile) {
                delete this.room.memory.monitoring.hostiles[hostileId];
            }
        });
    }
    monitorHostiles() {
        const hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);
        hostileCreeps.forEach(hostileCreep => {
            const hostileBodyParts = [];
            hostileCreep.body.forEach(bodyPartArray => {
                hostileBodyParts.push(bodyPartArray.type);
            });
            this.room.memory.monitoring.hostiles[hostileCreep.id] = {
                owner: hostileCreep.owner.username,
                bodyParts: hostileBodyParts,
                health: {
                    hits: hostileCreep.hits,
                    hitsMax: hostileCreep.hitsMax
                }
            };
        });
    }
};
HostileMonitor = __decorate([
    profile
], HostileMonitor);

let MineralMonitor = class MineralMonitor {
    constructor(mineralId) {
        this.mineralId = mineralId;
        this.monitorMineral();
    }
    monitorMineral() {
        const mineral = Game.getObjectById(this.mineralId);
        if (mineral) {
            const roomName = mineral.pos.roomName;
            Memory.rooms[roomName].monitoring.minerals[this.mineralId] = {
                remainingMineral: mineral.mineralAmount,
                mineralType: mineral.mineralType
            };
        }
    }
};
MineralMonitor = __decorate([
    profile
], MineralMonitor);

let SourceMonitor = class SourceMonitor {
    constructor(sourceId) {
        this.sourceId = sourceId;
        this.monitorSource();
    }
    monitorSource() {
        const source = Game.getObjectById(this.sourceId);
        if (source) {
            const roomName = source.pos.roomName;
            Memory.rooms[roomName].monitoring.sources[this.sourceId] = {
                totalEnergy: source.energyCapacity,
                remainingEnergy: source.energy
            };
        }
    }
};
SourceMonitor = __decorate([
    profile
], SourceMonitor);

let ContainerMonitor = class ContainerMonitor {
    constructor(container) {
        this.initalizeContainerMonitorMemory(container);
        this.monitorContainers(container);
    }
    initalizeContainerMonitorMemory(container) {
        if (!container.room.memory.monitoring.structures.containers) {
            container.room.memory.monitoring.structures.containers = {};
        }
    }
    monitorContainers(container) {
        if (container) {
            if (container.room.memory.monitoring.structures.containers) {
                const containerStorage = {};
                Object.entries(container.store).forEach(([resourceName]) => {
                    const resourceNameTyped = resourceName;
                    containerStorage[resourceName] = { amount: container.store[resourceNameTyped] };
                });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                container.room.memory.monitoring.structures.containers[container.id] = {
                    resources: containerStorage,
                    structure: {
                        hits: container.hits,
                        hitsMax: container.hitsMax
                    }
                };
            }
        }
    }
};
ContainerMonitor = __decorate([
    profile
], ContainerMonitor);

let ControllerMonitor = class ControllerMonitor {
    constructor(controller) {
        this.monitorController(controller);
    }
    monitorController(controller) {
        if (controller) {
            const room = controller.room;
            let controllerMonitorDictionary;
            if (controller.safeMode) {
                controllerMonitorDictionary = {
                    id: controller.id,
                    progress: controller.progress,
                    nextLevel: controller.progressTotal,
                    downgrade: controller.ticksToDowngrade,
                    safeMode: true,
                    safeModeCooldown: controller.safeMode
                };
            }
            else {
                controllerMonitorDictionary = {
                    id: controller.id,
                    progress: controller.progress,
                    nextLevel: controller.progressTotal,
                    downgrade: controller.ticksToDowngrade,
                    safeMode: false
                };
            }
            room.memory.monitoring.structures.controller = controllerMonitorDictionary;
        }
    }
};
ControllerMonitor = __decorate([
    profile
], ControllerMonitor);

let ExtensionMonitor = class ExtensionMonitor {
    constructor(extension) {
        this.initalizeExtensionMonitorMemory(extension);
        this.monitorExtensions(extension);
    }
    initalizeExtensionMonitorMemory(extension) {
        if (!extension.room.memory.monitoring.structures.extensions) {
            extension.room.memory.monitoring.structures.extensions = {};
        }
    }
    monitorExtensions(extension) {
        if (extension.room.memory.monitoring.structures.extensions) {
            extension.room.memory.monitoring.structures.extensions[extension.id] = {
                energyAvailable: extension.store[RESOURCE_ENERGY],
                energyCapacity: extension.store.getCapacity(RESOURCE_ENERGY)
            };
        }
    }
};
ExtensionMonitor = __decorate([
    profile
], ExtensionMonitor);

let ExtractorMonitor = class ExtractorMonitor {
    constructor(extractor) {
        this.initalizeExtractorMonitorMemory(extractor);
        this.monitorExtractors(extractor);
    }
    initalizeExtractorMonitorMemory(extractor) {
        if (!extractor.room.memory.monitoring.structures.extractors) {
            extractor.room.memory.monitoring.structures.extractors = {};
        }
    }
    monitorExtractors(extractor) {
        if (extractor) {
            if (extractor.room.memory.monitoring.structures.extractors) {
                extractor.room.memory.monitoring.structures.extractors[extractor.id] = {
                    structure: {
                        hits: extractor.hits,
                        hitsMax: extractor.hitsMax
                    }
                };
            }
        }
    }
};
ExtractorMonitor = __decorate([
    profile
], ExtractorMonitor);

let FactoryMonitor = class FactoryMonitor {
    constructor(factory) {
        this.monitorFactory(factory);
    }
    monitorFactory(factory) {
        if (factory) {
            const factoryStorage = {};
            Object.entries(factory.store).forEach(([resourceName]) => {
                const resourceNameTyped = resourceName;
                factoryStorage[resourceName] = { amount: factory.store[resourceNameTyped] };
            });
            factory.room.memory.monitoring.structures.factory = {
                resources: factoryStorage,
                structure: {
                    hits: factory.hits,
                    hitsMax: factory.hitsMax
                },
                cooldown: factory.cooldown,
                id: factory.id
            };
        }
    }
};
FactoryMonitor = __decorate([
    profile
], FactoryMonitor);

let LabMonitor = class LabMonitor {
    constructor(lab) {
        this.initalizeLabMonitorMemory(lab);
        this.monitorLabs(lab);
    }
    initalizeLabMonitorMemory(lab) {
        if (!lab.room.memory.monitoring.structures.labs) {
            lab.room.memory.monitoring.structures.labs = {};
        }
    }
    monitorLabs(lab) {
        if (lab) {
            if (lab.room.memory.monitoring.structures.labs) {
                const labStorage = {};
                Object.entries(lab.store).forEach(([resourceName]) => {
                    const resourceNameTyped = resourceName;
                    labStorage[resourceName] = { amount: lab.store[resourceNameTyped] };
                });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                lab.room.memory.monitoring.structures.labs[lab.id] = {
                    resources: labStorage,
                    structure: {
                        hits: lab.hits,
                        hitsMax: lab.hitsMax
                    },
                    cooldown: lab.cooldown
                };
            }
        }
    }
};
LabMonitor = __decorate([
    profile
], LabMonitor);

const linkConfig = {
    W56N12: {
        "6397f1bd30238608dae79135": "tx",
        "63b5d422245b4f17984d7ec3": "tx",
        "639b23129ab55f8634547d74": "rx",
        "63a3c1f82064b45cf37c59d8": "rx"
    }
};

let LinkMonitor = class LinkMonitor {
    constructor(link) {
        this.monitorLinks(link);
        this.initalizeLinkMonitorModes(link);
    }
    initalizeLinkMonitorModes(link) {
        if (link) {
            if (!Memory.rooms[link.pos.roomName].monitoring.structures.links[link.id].mode) {
                this.setLinkMode(link);
            }
        }
    }
    setLinkMode(link) {
        const linkRoom = link.pos.roomName;
        const linkId = link.id;
        const roomLinkConfig = linkConfig[linkRoom];
        if (roomLinkConfig) {
            if (roomLinkConfig[linkId]) {
                Memory.rooms[linkRoom].monitoring.structures.links[linkId].mode = roomLinkConfig[linkId];
            }
        }
    }
    monitorLinks(link) {
        if (link.room.memory.monitoring.structures.links) {
            if (link.room.memory.monitoring.structures.links[link.id]) {
                link.room.memory.monitoring.structures.links[link.id].energy = {
                    energyAvailable: link.store[RESOURCE_ENERGY],
                    energyCapacity: link.store.getCapacity(RESOURCE_ENERGY)
                };
            }
            else {
                link.room.memory.monitoring.structures.links[link.id] = {
                    energy: {
                        energyAvailable: link.store[RESOURCE_ENERGY],
                        energyCapacity: link.store.getCapacity(RESOURCE_ENERGY)
                    }
                };
            }
        }
    }
};
LinkMonitor = __decorate([
    profile
], LinkMonitor);

let RoadMonitor = class RoadMonitor {
    constructor(road) {
        this.initalizeRoadMonitorMemory(road);
        this.monitorRoads(road);
    }
    initalizeRoadMonitorMemory(road) {
        if (!road.room.memory.monitoring.structures.roads) {
            road.room.memory.monitoring.structures.roads = {};
        }
    }
    monitorRoads(road) {
        if (road.room.memory.monitoring.structures.roads) {
            road.room.memory.monitoring.structures.roads[road.id] = {
                structure: {
                    hits: road.hits,
                    hitsMax: road.hitsMax
                }
            };
        }
    }
};
RoadMonitor = __decorate([
    profile
], RoadMonitor);

let SpawnMonitor = class SpawnMonitor {
    // SpawnMonitor Interface
    constructor(spawn) {
        this.initializeSpawnMonitorMemory(spawn);
        this.monitorSpawn(spawn);
    }
    initializeSpawnMonitorMemory(spawn) {
        if (!spawn.room.memory.monitoring.structures.spawns) {
            spawn.room.memory.monitoring.structures.spawns = {};
        }
    }
    monitorSpawn(spawn) {
        let spawning = false;
        if (spawn.spawning != null) {
            spawning = true;
        }
        if (spawn.room.memory.monitoring.structures.spawns) {
            spawn.room.memory.monitoring.structures.spawns[spawn.name] = {
                id: spawn.id,
                energy: {
                    energyAvailable: spawn.store[RESOURCE_ENERGY],
                    energyCapacity: spawn.store.getCapacity(RESOURCE_ENERGY)
                },
                structure: {
                    hits: spawn.hits,
                    hitsMax: spawn.hitsMax
                },
                spawning
            };
        }
    }
};
SpawnMonitor = __decorate([
    profile
], SpawnMonitor);

let StorageMonitor = class StorageMonitor {
    constructor(storage) {
        this.monitorStorage(storage);
    }
    monitorStorage(storage) {
        if (storage) {
            storage.room.memory.monitoring.structures.storage = {
                id: storage.id,
                resources: {},
                structure: {
                    hits: storage.hits,
                    hitsMax: storage.hitsMax
                }
            };
            Object.entries(storage.store).forEach(([resourceTypeString]) => {
                const resourceType = resourceTypeString;
                if (storage.room.memory.monitoring.structures.storage) {
                    storage.room.memory.monitoring.structures.storage.resources[resourceTypeString] = {
                        resourceAmount: storage.store[resourceType],
                        resourceCapacity: storage.store.getCapacity(resourceType)
                    };
                }
            });
        }
    }
};
StorageMonitor = __decorate([
    profile
], StorageMonitor);

let TerminalMonitor = class TerminalMonitor {
    constructor(terminal) {
        this.monitorTerminal(terminal);
    }
    monitorTerminal(terminal) {
        if (terminal) {
            const terminalStorage = {};
            Object.entries(terminal.store).forEach(([resourceName]) => {
                const resourceNameTyped = resourceName;
                terminalStorage[resourceName] = { amount: terminal.store[resourceNameTyped] };
            });
            terminal.room.memory.monitoring.structures.terminal = {
                resources: terminalStorage,
                structure: {
                    hits: terminal.hits,
                    hitsMax: terminal.hitsMax
                },
                cooldown: terminal.cooldown
            };
        }
    }
};
TerminalMonitor = __decorate([
    profile
], TerminalMonitor);

let TowerMonitor = class TowerMonitor {
    constructor(tower) {
        this.initalizeTowerMonitorMemory(tower);
        this.monitorTower(tower);
    }
    initalizeTowerMonitorMemory(tower) {
        if (!tower.room.memory.monitoring.structures.towers) {
            tower.room.memory.monitoring.structures.towers = {};
        }
    }
    monitorTower(tower) {
        if (tower) {
            if (tower.room.memory.monitoring.structures.towers) {
                tower.room.memory.monitoring.structures.towers[tower.id] = {
                    energy: {
                        energyAvailable: tower.store[RESOURCE_ENERGY],
                        energyCapacity: tower.store.getCapacity(RESOURCE_ENERGY)
                    },
                    structure: {
                        hits: tower.hits,
                        hitsMax: tower.hitsMax
                    }
                };
            }
        }
    }
};
TowerMonitor = __decorate([
    profile
], TowerMonitor);

class StructureMonitor {
    constructor(room) {
        this.room = room;
        this.monitorStructures();
    }
    monitorStructures() {
        if (this.room) {
            this.room.memory.monitoring.structures = {
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
            };
            // console.log(JSON.stringify(this.room.find(FIND_STRUCTURES)));
            this.room.find(FIND_STRUCTURES).forEach(Structure => {
                switch (Structure.structureType) {
                    default:
                        this.room.memory.monitoring.structures.other[Structure.id] = {
                            structureType: Structure.structureType
                        };
                        break;
                    case STRUCTURE_CONTROLLER:
                        new ControllerMonitor(Structure);
                        break;
                    case STRUCTURE_SPAWN:
                        new SpawnMonitor(Structure);
                        break;
                    case STRUCTURE_EXTENSION:
                        new ExtensionMonitor(Structure);
                        break;
                    case STRUCTURE_TOWER:
                        new TowerMonitor(Structure);
                        break;
                    case STRUCTURE_LINK:
                        new LinkMonitor(Structure);
                        break;
                    case STRUCTURE_STORAGE:
                        new StorageMonitor(Structure);
                        break;
                    case STRUCTURE_CONTAINER:
                        new ContainerMonitor(Structure);
                        break;
                    case STRUCTURE_ROAD:
                        new RoadMonitor(Structure);
                        break;
                    case STRUCTURE_LAB:
                        new LabMonitor(Structure);
                        break;
                    case STRUCTURE_TERMINAL:
                        new TerminalMonitor(Structure);
                        break;
                    case STRUCTURE_FACTORY:
                        new FactoryMonitor(Structure);
                        break;
                    case STRUCTURE_EXTRACTOR:
                        new ExtractorMonitor(Structure);
                        break;
                }
            });
        }
    }
}

class RoomMonitor {
    constructor(RoomName) {
        this.roomName = RoomName;
        this.room = Game.rooms[RoomName];
        if (this.room) {
            if (!this.room.controller) {
                this.runChildMonitors();
            }
            else {
                if (!this.room.controller.owner) {
                    this.runChildMonitors();
                }
                if (this.room.controller.my) {
                    this.runChildMonitors();
                }
                if (roomsToClaim.includes(this.roomName) || roomsToMine.includes(this.roomName)) {
                    this.runChildMonitors();
                }
            }
        }
    }
    runChildMonitors() {
        this.runStructureMonitor();
        this.runEnergyMonitors();
        this.runHostileMonitor();
        this.runSourceMonitors();
        this.runDroppedResourceMonitors();
        this.runConstructionSiteMonitors();
        this.runMineralMonitors();
    }
    runStructureMonitor() {
        if (this.room.controller) {
            new StructureMonitor(this.room);
        }
    }
    runEnergyMonitors() {
        new EnergyMonitor(this.room);
    }
    runHostileMonitor() {
        new HostileMonitor(this.room);
    }
    runSourceMonitors() {
        this.room.find(FIND_SOURCES).forEach(source => {
            new SourceMonitor(source.id);
        });
    }
    runMineralMonitors() {
        this.room.find(FIND_MINERALS).forEach(mineral => {
            new MineralMonitor(mineral.id);
        });
    }
    runDroppedResourceMonitors() {
        new DroppedResourceMonitor(this.room);
    }
    runConstructionSiteMonitors() {
        new ConstructionSiteMonitor(this.room);
    }
}

class Monitor {
    constructor() {
        this.monitorRooms();
    }
    monitorRooms() {
        const roomsToMonitor = roomOperations.generateRoomsArray();
        roomsToMonitor.forEach(roomName => {
            new RoomMonitor(roomName);
        });
    }
}

class QueueMemoryController {
    constructor() {
        this.maintainQueueMemoryHealth();
    }
    maintainQueueMemoryHealth() {
        if (!Memory.queues) {
            this.initializeQueueMemory();
        }
        else {
            if (!Memory.queues.spawnQueue || !Memory.queues.jobQueue) {
                if (!Memory.queues.spawnQueue) {
                    this.initializeSpawnQueueMemory();
                }
                else {
                    if (!Memory.queues.jobQueue) {
                        this.initializeJobQueueMemory();
                    }
                }
            }
        }
    }
    initializeQueueMemory() {
        Memory.queues = {
            jobQueue: {},
            spawnQueue: {}
        };
    }
    initializeSpawnQueueMemory() {
        Memory.queues.spawnQueue = {};
    }
    initializeJobQueueMemory() {
        Memory.queues.jobQueue = {};
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
class RoomMemoryController {
    constructor(roomName) {
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
    maintainRoomMemoryHealth(pastKey, memoryDictionary) {
        if (!memoryDictionary) {
            if (!Memory.rooms[this.roomName]) {
                Memory.rooms[this.roomName] = this.roomMemorySchematic;
            }
            Object.entries(this.roomMemorySchematic).forEach(([key, value]) => {
                if (!Memory.rooms[this.roomName][key]) {
                    Memory.rooms[this.roomName][key] = value;
                }
                else {
                    this.maintainRoomMemoryHealth([key], value);
                }
            });
        }
        else {
            Object.entries(memoryDictionary).forEach(([key, value]) => {
                if (pastKey) {
                    if (pastKey.length === 1) {
                        if (!Memory.rooms[this.roomName][pastKey[0]][key]) {
                            Memory.rooms[this.roomName][pastKey[0]][key] = value;
                        }
                        else {
                            const newKey = pastKey.concat(key);
                            this.maintainRoomMemoryHealth(newKey, value);
                        }
                    }
                    else {
                        let path = "";
                        pastKey.forEach(lastKey => {
                            path = `${path}['${lastKey}']`;
                        });
                        path = `${path}['${key}']`;
                        const setMemoryCommand = `Memory.rooms['${this.roomName}']${path} = {}`;
                        const memoryExistsCommand = `!(Memory.rooms['${this.roomName}']${path} === undefined)`;
                        // eslint-disable-next-line no-eval
                        const memoryExists = eval(memoryExistsCommand);
                        if (!memoryExists) {
                            // eslint-disable-next-line no-eval
                            eval(setMemoryCommand);
                        }
                    }
                }
            });
        }
    }
}

class MemoryController {
    constructor() {
        this.maintainMemory();
    }
    maintainMemory() {
        this.maintainQueueMemory();
        this.maintainRoomMemory();
        this.maintainCreepMemory();
    }
    maintainQueueMemory() {
        new QueueMemoryController();
    }
    maintainCreepMemory() {
        if (!Memory.creeps) {
            Memory.creeps = {};
        }
        else {
            for (const name in Memory.creeps) {
                if (!(name in Game.creeps)) {
                    Log.Debug(`Clearing ${name} Creep Memory`);
                    delete Memory.creeps[name];
                }
            }
        }
    }
    maintainRoomMemory() {
        if (!Memory.rooms) {
            Memory.rooms = {};
        }
        const roomsToAddToMemory = roomOperations.generateRoomsArray();
        roomsToAddToMemory.forEach(roomName => {
            new RoomMemoryController(roomName);
        });
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
global.Profiler = init();
const loop = () => {
    Log.Informational(`Current game tick is ${Game.time}`);
    // garbageCollect.creeps();
    new MemoryController();
    new Monitor();
    new Operator();
    new GameMonitor();
    // resetQueues.resetAllQueues();
};

exports.loop = loop;
