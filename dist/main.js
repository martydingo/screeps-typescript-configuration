'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class GameMonitor {
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
}

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
        const roomTerrainMatrix = Game.rooms[roomName].getTerrain();
        for (let x = 2; x < 50; x++) {
            for (let y = 2; y < 50; y++) {
                if (roomTerrainMatrix.get(x, y) === 0) {
                    return new RoomPosition(x, y, roomName);
                }
            }
        }
        return new RoomPosition(25, 25, roomName);
    },
    findClosestSpawnToRoom(roomName) {
        const spawnDistanceMatrix = {};
        Object.entries(Game.spawns).forEach(([spawnName, spawn]) => {
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
            if (room.storage) {
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
    buildConstructionSite: 2,
    upgradeController: 1,
    lootResource: 1,
    scoutRoom: 1,
    claimRoom: 1,
    reserveRoom: 1,
    transportResource: 1,
    terminalEngineer: 1,
    labEngineer: 1
};

class ConstructionSiteOperator {
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
        if (Object.entries(Memory.rooms[roomName].monitoring.structures.spawns).length > 0) {
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
        if (Object.entries(Memory.rooms[roomName].monitoring.structures.spawns).length > 0) {
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
}

class UpgradeControllerJob {
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

class ControllerOperator {
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
                                const count = creepNumbers[JobParameters.jobType];
                                new UpgradeControllerJob(JobParameters, count);
                            }
                        }
                    }
                }
            }
        }
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
class BaseCreep {
    constructor(creep) {
        //
    }
    checkIfFull(creep, resource) {
        if (creep.memory.status === "fetchingResource") {
            if (creep.store.getFreeCapacity(resource) === 0) {
                creep.memory.status = "working";
            }
        }
        else if (creep.memory.status === "working") {
            if (creep.store[resource] === 0) {
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
        else {
            creep.memory.status = "working";
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
                creep.memory.status = "working";
            }
            else {
                const safeRouteHome = findPath.findSafePathToRoom(creep.pos.roomName, creep.memory.room);
                if (safeRouteHome !== -2) {
                    this.moveCreep(creep, new RoomPosition(25, 25, safeRouteHome[0].room));
                }
                else {
                    Log.Warning(`${creep.memory.jobType} creep with UUID ${creep.name} returned ${safeRouteHome}`);
                }
            }
        }
    }
    moveCreep(creep, destination) {
        const moveResult = creep.moveTo(destination, {
            visualizePathStyle: {
                fill: "transparent",
                stroke: "#efefef",
                lineStyle: "dashed",
                strokeWidth: 0.15,
                opacity: 0.6
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
}

class BuildConstructionSiteCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.checkIfFull(creep, RESOURCE_ENERGY);
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
}

class ClaimRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        var _a;
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
                                if (((_a = controllerToClaim.owner) === null || _a === void 0 ? void 0 : _a.username) === "Invader") {
                                    const attackControllerResult = creep.attackController(controllerToClaim);
                                    if (attackControllerResult === ERR_NOT_IN_RANGE) {
                                        this.moveCreep(creep, controllerToClaim.pos);
                                    }
                                    else {
                                        Log.Warning(`Attack Controller Result for ${creep.name} in ${creep.pos.roomName}: ${attackControllerResult}`);
                                    }
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
}

class FeedLinkCreep extends BaseCreep {
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
}

class FeedSpawnCreep extends BaseCreep {
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
}

class FeedTowerCreep extends BaseCreep {
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
}

class LabEngineerCreep extends BaseCreep {
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
}

class LootResourceCreep extends BaseCreep {
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
}

class ReserveRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        var _a;
        this.moveHome(creep);
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
                            else if (reserveResult === ERR_NOT_OWNER) {
                                if (((_a = controllerToReserve.owner) === null || _a === void 0 ? void 0 : _a.username) === "Invader") {
                                    const attackControllerResult = creep.attackController(controllerToReserve);
                                    if (attackControllerResult === ERR_NOT_IN_RANGE) {
                                        this.moveCreep(creep, controllerToReserve.pos);
                                    }
                                    else {
                                        Log.Warning(`Attack Controller Result for ${creep.name} in ${creep.pos.roomName}: ${attackControllerResult}`);
                                    }
                                }
                            }
                            else
                                Log.Warning(`Reserve Result for ${creep.name} in ${creep.pos.roomName}: ${reserveResult}`);
                        }
                    }
                }
            }
        }
    }
}

class ScoutRoomCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.moveHome(creep);
        if (creep.memory.status === "working") {
            this.moveCreep(creep, findPath.findClearTerrain(creep.room.name));
        }
    }
}

class SourceMinerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
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

class TerminalEngineerCreep extends BaseCreep {
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
}

class TransportResourceCreep extends BaseCreep {
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
}

class UpgradeControllerCreep extends BaseCreep {
    constructor(creep) {
        super(creep);
        this.runCreep(creep);
    }
    runCreep(creep) {
        this.boostBodyParts(creep, WORK, RESOURCE_CATALYZED_GHODIUM_ACID);
        this.checkIfFull(creep, RESOURCE_ENERGY);
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
}

class CreepOperator {
    constructor() {
        this.runCreeps();
    }
    runCreeps() {
        this.runFeedSpawnCreeps();
        this.runSourceMinerCreeps();
        this.runFeedTowerCreeps();
        this.runUpgradeControllerCreeps();
        this.runLootResourceCreeps();
        this.runTransportResourceCreeps();
        this.runScoutRoomCreeps();
        this.runReserveRoomCreeps();
        this.runClaimRoomCreeps();
        this.runBuildConstructionSiteCreeps();
        this.runFeedLinkCreeps();
        this.runTerminalEngineerCreeps();
        this.runLabEngineerCreeps();
    }
    runSourceMinerCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "mineSource")
            .forEach(([, creep]) => {
            new SourceMinerCreep(creep);
        });
    }
    runFeedSpawnCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "feedSpawn")
            .forEach(([, creep]) => {
            new FeedSpawnCreep(creep);
        });
    }
    runFeedTowerCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "feedTower")
            .forEach(([, creep]) => {
            new FeedTowerCreep(creep);
        });
    }
    runFeedLinkCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "feedLink")
            .forEach(([, creep]) => {
            new FeedLinkCreep(creep);
        });
    }
    runUpgradeControllerCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "upgradeController")
            .forEach(([, creep]) => {
            new UpgradeControllerCreep(creep);
        });
    }
    runBuildConstructionSiteCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "buildConstructionSite")
            .forEach(([, creep]) => {
            new BuildConstructionSiteCreep(creep);
        });
    }
    runLootResourceCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "lootResource")
            .forEach(([, creep]) => {
            new LootResourceCreep(creep);
        });
    }
    runTransportResourceCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "transportResource")
            .forEach(([, creep]) => {
            new TransportResourceCreep(creep);
        });
    }
    runScoutRoomCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "scoutRoom")
            .forEach(([, creep]) => {
            new ScoutRoomCreep(creep);
        });
    }
    runClaimRoomCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "claimRoom")
            .forEach(([, creep]) => {
            new ClaimRoomCreep(creep);
        });
    }
    runReserveRoomCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "reserveRoom")
            .forEach(([, creep]) => {
            new ReserveRoomCreep(creep);
        });
    }
    runTerminalEngineerCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "terminalEngineer")
            .forEach(([, creep]) => {
            new TerminalEngineerCreep(creep);
        });
    }
    runLabEngineerCreeps() {
        Object.entries(Game.creeps)
            .filter(([, Creep]) => Creep.memory.jobType === "labEngineer")
            .forEach(([, creep]) => {
            new LabEngineerCreep(creep);
        });
    }
}

class GameOperator {
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
}

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
    W8N3: {
        boostLab: "63a983d1da758c0321639c43"
    }
};

class LabOperator {
    constructor() {
        if (Memory.rooms) {
            Object.entries(Memory.rooms).forEach(([roomName]) => {
                Object.entries(Memory.rooms[roomName].monitoring.structures.labs).forEach(([labIdString]) => {
                    const labId = labIdString;
                    const lab = Game.getObjectById(labId);
                    if (lab) {
                        this.manageLabJobs(lab);
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
}

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

const linkConfig = {
    W8N3: {
        "63ab0a6e26553d03dcda0a60": "tx",
        "63ab0b731b113d034be84db0": "rx"
    }
};

/* eslint-disable @typescript-eslint/no-unsafe-argument */
class LinkOperator {
    constructor() {
        this.operateLinks();
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
    operateLinks() {
        Object.entries(Game.rooms).forEach(([roomName]) => {
            if (Memory.rooms[roomName].monitoring.structures.links) {
                Object.entries(Memory.rooms[roomName].monitoring.structures.links).forEach(([linkIdString]) => {
                    const linkId = linkIdString;
                    const link = Game.getObjectById(linkId);
                    if (link) {
                        if (!Memory.rooms[roomName].monitoring.structures.links[linkId].mode) {
                            this.setLinkMode(link);
                        }
                        else {
                            const linkMode = Memory.rooms[roomName].monitoring.structures.links[linkId].mode;
                            if (linkMode === "tx") {
                                this.createLinkFeederJob(link);
                                this.transmitEnergy(link);
                            }
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
}

const creepBodyParts = {
    // First level of nesting, calculated by energyCapacityAvailable, grouped by their RCL maximums.
    1: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, MOVE, CARRY],
        workTerminal: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        feedSpawn: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        terminalEngineer: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        labEngineer: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        transportResource: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        feedTower: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        feedLink: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        upgradeController: [WORK, WORK, CARRY, MOVE],
        buildConstructionSite: [WORK, WORK, CARRY, MOVE],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM]
    },
    2: {
        // Second level is the jobType.
        mineSource: [WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY],
        workTerminal: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedSpawn: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        terminalEngineer: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        labEngineer: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        transportResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedTower: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        feedLink: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        lootResource: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        upgradeController: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        buildConstructionSite: [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, MOVE],
        scoutRoom: [MOVE, MOVE, MOVE, MOVE, MOVE],
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
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
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
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
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
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
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
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
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
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
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM]
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
        claimRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
        reserveRoom: [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM]
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

class JobQueueOperator {
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
}

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
        buildConstructionSite: 12,
        terminalEngineer: 13,
        labEngineer: 14
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
                labEngineer: priority.labEngineer
            };
        }
    }
    return priority;
}

class SpawnQueueOperator {
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
}

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

const roomsToClaim = [];

const roomsToMine = ["W8N2"];

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
            Object.entries(Game.rooms).forEach(([roomName]) => {
                roomsArray.push(roomName);
            });
        }
        return roomsArray;
    }
};

class RoomOperator {
    constructor() {
        const roomsToOperate = roomOperations.generateRoomsArray();
        //
        roomsToOperate.forEach(roomName => {
            var _a, _b;
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
                                this.createReserveRoomJob(roomName);
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
        const spawnRoom = findPath.findClosestSpawnToRoom(roomName).pos.roomName;
        const jobParameters = {
            jobType: "reserveRoom",
            status: "movingIntoRoom",
            room: roomName,
            spawnRoom
        };
        new ReserveRoomJob(jobParameters);
    }
}

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

class SourceOperator {
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
}

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

class SpawnOperator {
    constructor() {
        this.createSpawnFeederJobs();
        Object.entries(Game.rooms).forEach(([roomName]) => {
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
}

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

class TerminalOperator {
    constructor() {
        if (Memory.rooms) {
            Object.entries(Memory.rooms).forEach(([roomName]) => {
                const room = Game.rooms[roomName];
                if (room) {
                    if (room.terminal) {
                        this.manageTerminalJobs(room.terminal);
                        this.maintainTerminalEngineerJobs(room.terminal);
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
}

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

class TowerOperator {
    constructor() {
        if (Memory.rooms) {
            Object.entries(Memory.rooms).forEach(([roomName]) => {
                const towersInMemory = Memory.rooms[roomName].monitoring.structures.towers;
                if (towersInMemory) {
                    Object.entries(towersInMemory).forEach(([towerIdString]) => {
                        const towerId = towerIdString;
                        const tower = Game.getObjectById(towerId);
                        if (tower) {
                            this.createTowerFeederJob(tower);
                            this.operateTowers(tower);
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
}

class Operator {
    constructor() {
        this.runOperators();
    }
    runOperators() {
        this.runRoomOperator();
        this.runControllerOperator();
        this.runSourceOperator();
        this.runTowerOperator();
        this.runCreepOperator();
        this.runLinkOperator();
        this.runConstructionSiteOperator();
        this.runQueueOperator();
        this.runSpawnOperator();
        this.runGameOperator();
        this.runTerminalOperator();
        this.runLabOperator();
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
}

const garbageCollect = {
    creeps() {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                Log.Debug(`Clearing ${name} Creep Memory`);
                delete Memory.creeps[name];
            }
        }
    }
};

class ConstructionSiteMonitor {
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
}

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

class DroppedResourceMonitor {
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
                const jobParameters = {
                    room: this.room.name,
                    status: "fetchingResource",
                    jobType: "lootResource"
                };
                const count = creepNumbers[jobParameters.jobType];
                new LootResourceJob(jobParameters, count);
            }
        }
    }
}

class EnergyMonitor {
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
}

class HostileMonitor {
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
}

class SourceMonitor {
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
}

class ContainerMonitor {
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
}

class ControllerMonitor {
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
}

class ExtensionMonitor {
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
}

class LabMonitor {
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
}

class LinkMonitor {
    constructor(link) {
        this.initalizeLinkMonitorMemory(link);
        this.monitorLinks(link);
    }
    initalizeLinkMonitorMemory(link) {
        if (!link.room.memory.monitoring.structures.links) {
            link.room.memory.monitoring.structures.links = {};
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
}

class RoadMonitor {
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
}

class SpawnMonitor {
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
}

class StorageMonitor {
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
}

class TerminalMonitor {
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
}

class TowerMonitor {
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
}

class StructureMonitor {
    constructor(room) {
        this.room = room;
        this.monitorStructures();
    }
    monitorStructures() {
        if (this.room) {
            // console.log(JSON.stringify(this.room.find(FIND_STRUCTURES)));
            this.room.find(FIND_STRUCTURES).forEach(Structure => {
                if (Structure.structureType === STRUCTURE_CONTROLLER) {
                    new ControllerMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_SPAWN) {
                    new SpawnMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_EXTENSION) {
                    new ExtensionMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_TOWER) {
                    new TowerMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_LINK) {
                    new LinkMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_STORAGE) {
                    new StorageMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_CONTAINER) {
                    new ContainerMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_ROAD) {
                    new RoadMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_LAB) {
                    new LabMonitor(Structure);
                }
                else if (Structure.structureType === STRUCTURE_TERMINAL) {
                    new TerminalMonitor(Structure);
                }
                else {
                    this.room.memory.monitoring.structures.other[Structure.id] = {
                        structureType: Structure.structureType
                    };
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
            this.runChildMonitors();
        }
    }
    runChildMonitors() {
        this.runStructureMonitor();
        this.runEnergyMonitors();
        this.runHostileMonitor();
        this.runSourceMonitors();
        this.runDroppedResourceMonitors();
        this.runConstructionSiteMonitors();
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
                structures: {
                    spawns: {},
                    extensions: {},
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
                labQueue: {}
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
                        let setMemoryCommand = "";
                        pastKey.forEach(lastKey => {
                            setMemoryCommand = `${setMemoryCommand}['${lastKey}']`;
                        });
                        setMemoryCommand = `${setMemoryCommand}['${key}']`;
                        setMemoryCommand = `Memory.rooms['${this.roomName}']${setMemoryCommand} = {}`;
                        // eslint-disable-next-line no-eval
                        eval(setMemoryCommand);
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
    }
    maintainQueueMemory() {
        new QueueMemoryController();
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

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
const loop = () => {
    Log.Informational(`Current game tick is ${Game.time}`);
    garbageCollect.creeps();
    new MemoryController();
    new Monitor();
    new Operator();
    new GameMonitor();
    // resetQueues.resetAllQueues();
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
