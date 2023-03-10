import { BuildConstructionSiteCreep } from "classes/Creep/BuildConstructionSiteCreep";
import { ClaimRoomCreep } from "classes/Creep/ClaimRoomCreep";
import { DefendRoomCreep } from "classes/Creep/DefendRoomCreep";
import { DismantleEnemyBuildingsCreep } from "classes/Creep/DismantleEnemyBuildingsCreep";
import { FactoryEngineerCreep } from "classes/Creep/FactoryEngineerCreep";
import { FeedLinkCreep } from "classes/Creep/FeedLinkCreep";
import { FeedSpawnCreep } from "classes/Creep/FeedSpawnCreep";
import { FeedTowerCreep } from "classes/Creep/FeedTowerCreep";
import { harvestDepositCreep } from "classes/Creep/HarvestDepositCreep";
import { LabEngineerCreep } from "classes/Creep/LabEngineerCreep";
import { LootResourceCreep } from "classes/Creep/LootResourceCreep";
import { ReserveRoomCreep } from "classes/Creep/ReserveRoomCreep";
import { ScoutRoomCreep } from "classes/Creep/ScoutRoomCreep";
import { SourceMinerCreep } from "classes/Creep/SourceMinerCreep";
import { TankRoomCreep } from "classes/Creep/TankRoomCreep";
import { TerminalEngineerCreep } from "classes/Creep/TerminalEngineerCreep";
import { TransportResourceCreep } from "classes/Creep/TransportResourceCreep";
import { UpgradeControllerCreep } from "classes/Creep/UpgradeControllerCreep";
import { Log } from "classes/Log";

export class CreepOperator {
  public constructor() {
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

        case "harvestDeposit":
          new harvestDepositCreep(creepToOperate);
          break;

        default:
          Log.Alert(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${creepToOperate.memory.jobType} registered on ${creepToOperate.name} in ${creepToOperate.room.name} does not correspond with any valid jobTypes`
          );
      }
    });
  }
}
