import { profile } from "Profiler";
import { BuildConstructionSiteCreep } from "classes/Creep/BuildConstructionSiteCreep";
import { ClaimRoomCreep } from "classes/Creep/ClaimRoomCreep";
import { FactoryEngineerCreep } from "classes/Creep/FactoryEngineerCreep";
import { FeedLinkCreep } from "classes/Creep/FeedLinkCreep";
import { FeedSpawnCreep } from "classes/Creep/FeedSpawnCreep";
import { FeedTowerCreep } from "classes/Creep/FeedTowerCreep";
import { LabEngineerCreep } from "classes/Creep/LabEngineerCreep";
import { LootResourceCreep } from "classes/Creep/LootResourceCreep";
import { ReserveRoomCreep } from "classes/Creep/ReserveRoomCreep";
import { ScoutRoomCreep } from "classes/Creep/ScoutRoomCreep";
import { SourceMinerCreep } from "classes/Creep/SourceMinerCreep";
import { TerminalEngineerCreep } from "classes/Creep/TerminalEngineerCreep";
import { TransportResourceCreep } from "classes/Creep/TransportResourceCreep";
import { UpgradeControllerCreep } from "classes/Creep/UpgradeControllerCreep";
import { Log } from "classes/Log";

@profile
export class CreepOperator {
  public constructor() {
    this.runCreeps();
  }
  private runCreeps() {
    Object.entries(Game.creeps).forEach(([, creepToOperate]) => {
      const creepJobType = creepToOperate.memory.jobType;
      switch (creepJobType) {
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

        case "claimRoom":
          new ClaimRoomCreep(creepToOperate);
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
        default:
          Log.Alert(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${creepJobType} registered on ${creepToOperate.name} in ${creepToOperate.room.name} does not correspond with any valid jobTypes`
          );
      }
    });
  }
}
