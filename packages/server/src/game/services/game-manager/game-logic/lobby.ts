import { GameModel, LobbyModel, PlayerModel } from "@dpg/types";
import { AGame, GameInstance } from "./game.js";

export class Lobby implements GameInstance {
  public state: LobbyModel.State;

  constructor(private game: AGame) {
    const lobbyEndTime = new Date(Date.now() + game.constants.lobbyTime);
    const players: GameModel.Player[] = [];
    game.players.forEach((id: PlayerModel.ID) => {
      players.push({
        id,
        avatar: 0,
      });
    });

    this.state = {
      type: "lobby",
      lobbyEndTime: lobbyEndTime,
      players,
    };
  }

  submitAction(playerID: string, action: LobbyModel.PlayerData): void {
    this.state.players = this.state.players.map((player: GameModel.Player) =>
      player.id === playerID
        ? {
            id: player.id,
            avatar: action.avatar,
          }
        : player
    );
    this.game.emitState();
  }
}
