import { GameModel, GameTwoTutorialModel, PlayerModel } from "@dpg/types";
import { GameTwo } from "./game-two.js";
import { AGame, GameInstance } from "./game.js";

export class GameTwoTutorial implements GameInstance {
  public state: GameTwoTutorialModel.State;

  constructor(private game: AGame, winners: PlayerModel.Id[], losers: PlayerModel.Id[]) {
    const tutorialEndTime = new Date(Date.now() + game.constants.gameTwoTutorialTime);

    this.state = {
      type: "game-two-tutorial",
      tutorialEndTime: tutorialEndTime,
      winners: winners,
      losers: losers,
    };

    this.submitAction();

    setTimeout(
      () => this.game.goToGame(new GameTwo(this.game, winners, losers)),
      game.constants.gameTwoTutorialTime
    );
  }

  getState(player: PlayerModel.Id): GameModel.GameState {
    return this.state;
  }

  submitAction(): void {
    this.game.emitState();
  }
}