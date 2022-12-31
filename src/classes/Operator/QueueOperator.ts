import { JobQueueOperator } from "./QueueOperator/JobQueueOperator";
import { SpawnQueueOperator } from "./QueueOperator/SpawnQueueOperator";

export class QueueOperator {
  public constructor() {
    this.runQueueOperators();
    this.runSpawnQueueOperator();
  }
  private runQueueOperators() {
    this.runJobQueueOperator();
  }
  private runJobQueueOperator() {
    new JobQueueOperator();
  }
  private runSpawnQueueOperator() {
    new SpawnQueueOperator();
  }
}
