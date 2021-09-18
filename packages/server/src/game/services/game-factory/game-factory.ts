import { GameModel } from "@dpg/types";
import { AGame } from "../game-manager/game-logic/game";

export abstract class GameFactory {
  abstract create(
    emitState: (state: GameModel.State) => void,
    endGame: () => void
  ): AGame;
}