import { GameTwoModel } from "@dpg/types";
import { AGame, GameInstance } from "./game.js";

export class GameTwo implements GameInstance {
  public state: GameTwoModel.State;

  constructor(private game: AGame) {
    throw new Error("Method not implemented.");
  }

  submitAction(playerID: string, action: GameTwoModel.Turn): void {
    throw new Error("Method not implemented.");
  }
}