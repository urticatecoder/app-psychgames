import { GameTwoModel } from "@dpg/types";
import { GameInstance } from "./game";

export class GameTwo implements GameInstance {
  constructor(
    private emitState: (state: GameTwoModel.State) => void,
    private goToNextGame: () => void
  ) {
    throw new Error("Method not implemented.");
  }

  submitAction(playerID: string, action: GameTwoModel.Turn): void {
    throw new Error("Method not implemented.");
  }
  getState(): GameTwoModel.State {
    throw new Error("Method not implemented.");
  }
}
