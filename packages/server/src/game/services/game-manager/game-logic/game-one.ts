import { GameOneModel } from "@dpg/types";
import { Socket } from "socket.io";
import { GameInstance } from "./game";

export class GameOne implements GameInstance {
  constructor(private goToNextGame: () => void, private room: Socket) {}

  submitAction(playerID: string, action: GameOneModel.Turn): void {
    throw new Error("Method not implemented.");
  }
  getState(): GameOneModel.State {
    throw new Error("Method not implemented.");
  }
}
