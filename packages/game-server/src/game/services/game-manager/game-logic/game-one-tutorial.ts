import { GameModel, GameOneTutorialModel, PlayerModel } from "@dpg/types";
import { GameOne } from "./game-one.js";
import { AGame, GameInstance } from "./game.js";

export class GameOneTutorial implements GameInstance {
  public state: GameOneTutorialModel.State;

  constructor(private game: AGame) {
    const tutorialEndTime = new Date(Date.now() + game.constants.gameOneTutorialTime);

    this.state = {
      type: "game-one-tutorial",
      tutorialEndTime: tutorialEndTime,
    };

    this.submitAction();

    setTimeout(
      () => this.game.goToGame(new GameOne(this.game)),
      game.constants.gameOneTutorialTime
    );
  }

  getState(player: PlayerModel.Id): GameModel.GameState {
    return this.state;
  }

  submitAction(): void {
    this.game.emitState();
  }
}