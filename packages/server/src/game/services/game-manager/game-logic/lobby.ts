import { LobbyModel } from "@dpg/types";
import { GameInstance } from "./game";

export class Lobby implements GameInstance {
  constructor(
    private emitState: (state: LobbyModel.State) => void,
    private goToNextGame: () => void
  ) {
    throw new Error("Method not implemented.");
  }

  submitAction(playerID: string, action: LobbyModel.PlayerData): void {
    throw new Error("Method not implemented.");
  }
  getState(): LobbyModel.State {
    throw new Error("Method not implemented.");
  }
}
