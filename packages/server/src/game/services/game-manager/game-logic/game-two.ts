import { GameTwoModel } from "@dpg/types";
import { Socket } from "socket.io";
import { GameInstance } from "./game";

export class GameTwo implements GameInstance {
  constructor(private goToNextGame: () => void, private room: Socket) {}

  submitAction(playerID: string, action: GameTwoModel.Turn): void {
    throw new Error("Method not implemented.");
  }
  getState(): GameTwoModel.State {
    throw new Error("Method not implemented.");
  }
}
