import { LobbyModel } from "@dpg/types";
import { AGame, GameInstance } from "./game";

export class Lobby implements GameInstance {
  constructor(private game: AGame) {}

  submitAction(playerID: string, action: LobbyModel.PlayerData): void {
    throw new Error("Method not implemented.");
  }
  getState(): LobbyModel.State {
    throw new Error("Method not implemented.");
  }
}
