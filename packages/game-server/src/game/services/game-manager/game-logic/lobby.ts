import { GameModel, LobbyModel, PlayerModel } from "@dpg/types";
import { GameOneTutorial } from "./game-one-tutorial.js";
import { AGame, GameInstance } from "./game.js";
import { AVAILABLE_AVATARS } from "@dpg/constants";

export class Lobby implements GameInstance {
  public state: LobbyModel.State;
  private submittedAvatar: Set<PlayerModel.Id>;

  constructor(private game: AGame) {
    const lobbyEndTime = new Date(Date.now() + game.constants.lobbyTime);
    this.submittedAvatar = new Set();

    this.state = {
      type: "lobby",
      lobbyEndTime: lobbyEndTime,
    };

    setTimeout(() => {
      // Randomize avatars not explicitly set
      this.game.players.forEach((player) => {
        if (!this.submittedAvatar.has(player)) {
          this.setAvatar(player, Math.floor(Math.random() * AVAILABLE_AVATARS));
        }
      });

      this.game.goToGame(new GameOneTutorial(this.game));
    }, game.constants.lobbyTime);
  }

  getState(player: PlayerModel.Id): GameModel.GameState {
    return this.state;
  }

  setAvatar(player: PlayerModel.Id, avatar: number) {
    this.game.playerMap.set(player, {
      id: player,
      avatar: avatar,
    });
  }

  submitAction(playerId: string, action: LobbyModel.AvatarRequest): void {
    this.setAvatar(playerId, action.avatar);
    this.submittedAvatar.add(playerId);

    this.game.emitState();
  }
}
