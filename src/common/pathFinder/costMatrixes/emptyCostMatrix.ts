export class emptyCostMatrix {
  public costMatrix: CostMatrix;
  public constructor(roomName: string) {
    this.costMatrix = PathFinder.CostMatrix;
    this.generateCostMatrix();
    this.fetch();
  }
  public regenerateCostMatrix(): void {
    this.generateCostMatrix();
  }
  public fetch(): CostMatrix {
    return this.costMatrix;
  }
  public generateCostMatrix(): void {
    //
  }
}
