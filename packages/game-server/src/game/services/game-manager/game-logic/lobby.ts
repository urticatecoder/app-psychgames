import { GameModel, LobbyModel, PlayerModel } from "@dpg/types";
import { GameOne } from "./game-one.js";
import { AGame, GameInstance } from "./game.js";

export class Lobby implements GameInstance {
  public state: LobbyModel.State;

  constructor(private game: AGame) {
    const lobbyEndTime = new Date(Date.now() + game.constants.lobbyTime);

    this.state = {
      type: "lobby",
      lobbyEndTime: lobbyEndTime,
    };

    setTimeout(
      () => this.game.goToGame(new GameOne(this.game)),
      game.constants.lobbyTime
    );
  }

  getState(player: PlayerModel.Id): GameModel.GameState {
    return this.state;
  }

  submitAction(playerId: string, action: LobbyModel.AvatarRequest): void {
    this.game.playerMap.set(playerId, {
      id: playerId,
      avatar: action.avatar,
    });

    this.game.emitState();
  }
}
