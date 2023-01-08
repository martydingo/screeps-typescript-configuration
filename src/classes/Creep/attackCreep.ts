import { BaseCreep } from "classes/BaseCreep";

export class attackCreep extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
    this.runCreep(creep);
  }
  private runCreep(creep: Creep) {
    //
  }
}
