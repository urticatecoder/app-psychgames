import { GameOneModel } from "@dpg/types";
import { GameInstance } from "./game";

export class GameOne implements GameInstance {
  constructor(
    private emitState: (state: GameOneModel.State) => void,
    private goToNextGame: () => void
  ) {
    throw new Error("Method not implemented.");
  }

  submitAction(playerID: string, action: GameOneModel.Turn): void {
    throw new Error("Method not implemented.");
  }
  getState(): GameOneModel.State {
    throw new Error("Method not implemented.");
  }
}
