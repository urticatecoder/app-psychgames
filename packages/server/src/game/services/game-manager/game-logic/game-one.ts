import { GameOneModel } from "@dpg/types";
import { AGame, GameInstance } from "./game.js";

export class GameOne implements GameInstance {
  constructor(private game: AGame) {
    throw new Error("Method not implemented.");
  }

  submitAction(playerID: string, action: GameOneModel.Turn): void {
    throw new Error("Method not implemented.");
  }
  getState(): GameOneModel.State {
    throw new Error("Method not implemented.");
  }
}
