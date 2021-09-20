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

  private beginRound() {
    const roundStartTime = new Date();
    const roundEndTime = new Date(
      roundStartTime.getTime() +
        this.game.constants.gameOneRoundTime(this.state.round)
    );

    this.state = {
      ...this.state,
      roundStartTime,
      roundEndTime,
    };
    this.game.emitState();

    // timeout to advance round
    setTimeout(() => this.advanceRound(), roundEndTime.getTime() - Date.now());
  }

  private advanceRound() {
    const playerPositions = this.calculatePlayerPositions();
    this.state = {
      ...this.state,
      round: this.state.round + 1,
      playerPositions,
    };
    this.beginRound();
  }

  private calculatePlayerPositions(): GameOneModel.PlayerPosition[] {
    throw new Error("Method not implemented");
  }
}
