import { GameModel, FinalResultsModel, PlayerModel, GameTwoModel } from "@dpg/types";
import { AGame, GameInstance } from "./game.js";

export class FinalResults implements GameInstance {
  public state: FinalResultsModel.State;

  constructor(private game: AGame, private playerEarnings: Map<PlayerModel.Id, GameTwoModel.PlayerResults>, winners: PlayerModel.Id[], losers: PlayerModel.Id[]) {
    this.state = {
      type: "final-results",
      winners: winners,
      losers: losers,
      prolificCode: this.game.constants.finalResultsProlificCode,
    };

    this.submitAction();

    setTimeout(
      () => this.game.endGame(),
      30000 //End the game after 30 seconds
    );
  }

  getState(player: PlayerModel.Id): GameModel.GameState {
    let stateObj = this.state;
    stateObj.playerResults = this.playerEarnings.get(player);
    
    return stateObj;
  }

  submitAction(): void {
    this.game.emitState();
  }
}