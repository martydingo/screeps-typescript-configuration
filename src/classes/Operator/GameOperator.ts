import { profile } from "Profiler";
@profile
export class GameOperator {
  public constructor() {
    this.generatePixel();
  }
  private generatePixel() {
    if (Game.cpu) {
      if (Game.cpu.generatePixel && Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
      }
    }
  }
}
