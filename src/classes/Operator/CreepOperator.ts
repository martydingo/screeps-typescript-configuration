import { BuildConstructionSiteCreep } from "classes/Creep/BuildConstructionSiteCreep";
import { ClaimRoomCreep } from "classes/Creep/ClaimRoomCreep";
import { FeedLinkCreep } from "classes/Creep/FeedLinkCreep";
import { FeedSpawnCreep } from "classes/Creep/FeedSpawnCreep";
import { FeedTowerCreep } from "classes/Creep/FeedTowerCreep";
import { LootResourceCreep } from "classes/Creep/LootResourceCreep";
import { ReserveRoomCreep } from "classes/Creep/ReserveRoomCreep";
import { ScoutRoomCreep } from "classes/Creep/ScoutRoomCreep";
import { SourceMinerCreep } from "classes/Creep/SourceMinerCreep";
import { UpgradeControllerCreep } from "classes/Creep/UpgradeControllerCreep";

export class CreepOperator {
  public constructor() {
    this.runCreeps();
  }
  private runCreeps() {
    this.runFeedSpawnCreeps();
    this.runSourceMinerCreeps();
    this.runFeedTowerCreeps();
    this.runUpgradeControllerCreeps();
    this.runLootResourceCreeps();
    this.runScoutRoomCreeps();
    this.runReserveRoomCreeps();
    this.runClaimRoomCreeps();
    this.runBuildConstructionSiteCreeps();
    this.runFeedLinkCreeps();
  }
  private runSourceMinerCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "mineSource")
      .forEach(([, creep]) => {
        new SourceMinerCreep(creep);
      });
  }
  private runFeedSpawnCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "feedSpawn")
      .forEach(([, creep]) => {
        new FeedSpawnCreep(creep);
      });
  }
  private runFeedTowerCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "feedTower")
      .forEach(([, creep]) => {
        new FeedTowerCreep(creep);
      });
  }
  private runFeedLinkCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "feedLink")
      .forEach(([, creep]) => {
        new FeedLinkCreep(creep);
      });
  }
  private runUpgradeControllerCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "upgradeController")
      .forEach(([, creep]) => {
        new UpgradeControllerCreep(creep);
      });
  }
  private runBuildConstructionSiteCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "buildConstructionSite")
      .forEach(([, creep]) => {
        new BuildConstructionSiteCreep(creep);
      });
  }
  private runLootResourceCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "lootResource")
      .forEach(([, creep]) => {
        new LootResourceCreep(creep);
      });
  }
  private runScoutRoomCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "scoutRoom")
      .forEach(([, creep]) => {
        new ScoutRoomCreep(creep);
      });
  }
  private runClaimRoomCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "claimRoom")
      .forEach(([, creep]) => {
        new ClaimRoomCreep(creep);
      });
  }
  private runReserveRoomCreeps() {
    Object.entries(Game.creeps)
      .filter(([, Creep]) => Creep.memory.jobType === "reserveRoom")
      .forEach(([, creep]) => {
        new ReserveRoomCreep(creep);
      });
  }
}
