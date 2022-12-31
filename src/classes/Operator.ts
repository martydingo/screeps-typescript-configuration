import { ConstructionSiteOperator } from "./Operator/ConstructionSiteOperator";
import { ControllerOperator } from "./Operator/ControllerOperator";
import { CreepOperator } from "./Operator/CreepOperator";
import { FactoryOperator } from "./Operator/FactoryOperator";
import { GameOperator } from "./Operator/GameOperator";
import { LabOperator } from "./Operator/LabOperator";
import { LinkOperator } from "./Operator/LinkOperator";
import { QueueOperator } from "./Operator/QueueOperator";
import { RoomOperator } from "./Operator/RoomOperator";
import { SourceOperator } from "./Operator/SourceOperator";
import { SpawnOperator } from "./Operator/SpawnOperator";
import { TerminalOperator } from "./Operator/TerminalOperator";
import { TowerOperator } from "./Operator/TowerOperator";

export class Operator {
  public constructor() {
    this.runOperators();
  }
  private runOperators() {
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
    this.runCreepOperator();
    this.runFactoryOperator();
  }
  private runControllerOperator() {
    new ControllerOperator();
  }
  private runSourceOperator() {
    new SourceOperator();
  }
  private runQueueOperator() {
    new QueueOperator();
  }
  private runSpawnOperator() {
    new SpawnOperator();
  }
  private runTowerOperator() {
    new TowerOperator();
  }
  private runCreepOperator() {
    new CreepOperator();
  }
  private runLinkOperator() {
    new LinkOperator();
  }
  private runConstructionSiteOperator() {
    new ConstructionSiteOperator();
  }
  private runRoomOperator() {
    new RoomOperator();
  }
  private runTerminalOperator() {
    new TerminalOperator();
  }
  private runLabOperator() {
    new LabOperator();
  }
  private runGameOperator() {
    new GameOperator();
  }
  private runFactoryOperator() {
    new FactoryOperator();
  }
}
