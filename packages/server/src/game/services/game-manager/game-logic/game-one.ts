import { GameOneModel, GameModel, PlayerModel } from "@dpg/types";
import { AGame, GameInstance } from "./game.js";

export class GameOne implements GameInstance {
  private selections: Map<PlayerModel.ID, Set<PlayerModel.ID>>;

  public state: GameOneModel.State;

  constructor(private game: AGame) {
    this.selections = new Map();
    const playerPositions: GameOneModel.PlayerPosition[] = [];
    game.players.forEach((player: GameModel.Player) => {
      playerPositions.push({
        player,
        position: 0.5,
      });
    });

    this.state = {
      type: "game-one",
      round: 0,
      // will be set on round start
      roundStartTime: new Date(),
      roundEndTime: new Date(),
      playerPositions,
    };

    this.beginRound();
  }

  submitAction(playerID: string, action: GameOneModel.Turn): void {
    this.selections.set(
      playerID,
      new Set(
        action.playersSelected.map((player: GameModel.Player) => player.id)
      )
    );
  }

  beginRound() {
    throw new Error("Method not implemented");
  }

  advanceRound() {
    throw new Error("Method not implemented");
  }
}
