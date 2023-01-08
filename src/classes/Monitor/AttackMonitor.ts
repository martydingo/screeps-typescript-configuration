import { base64 } from "common/utilities/base64";
import { roomsToAttack } from "configuration/rooms/roomsToAttack";

export class AttackMonitor {
  public constructor() {
    this.maintainAttackRoomJobs();
  }
  private generateAttackJobUUID(mode: string, target: string) {
    return base64.encode(`attack-${mode}-${target}`);
  }
  private maintainAttackRoomJobs() {
    roomsToAttack.forEach(roomName => {
      const attackJobUuid = this.generateAttackJobUUID("room", roomName);
      Memory.queues.attackQueue[attackJobUuid] = {
        mode: "room",
        target: roomName
      };
    });
    Object.entries(Memory.queues.attackQueue)
      .filter(([, attackQueueEntry]) => attackQueueEntry.mode === "room")
      .forEach(([attackQueueUuid, attackQueueEntry]) => {
        if (!roomsToAttack.includes(attackQueueEntry.target)) {
          delete Memory.queues.attackQueue[attackQueueUuid];
        }
      });
  }
}
