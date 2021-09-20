import { GameModel, LobbyModel, PlayerModel } from "@dpg/types";
import { AGame, GameInstance } from "./game.js";

export class Lobby implements GameInstance {
  public state: LobbyModel.State;

  constructor(private game: AGame) {
    const lobbyEndTime = new Date(Date.now() + game.constants.lobbyTime);
    const players: GameModel.Player[] = [];

    this.state = {
      type: "lobby",
      lobbyEndTime: lobbyEndTime,
    };
  }

  submitAction(playerID: string, action: LobbyModel.PlayerData): void {
    this.game.playerMap.set(playerID, {
      id: playerID,
      avatar: action.avatar,
    });

    this.game.emitState();
  }
}
