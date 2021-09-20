import { GameModel } from "@dpg/types";
import { GameConstants } from "src/game/constants.js";
import { AGame } from "../game-manager/game-logic/game.js";

export abstract class GameFactory {
  abstract create(
    emitState: (state: GameModel.State) => void,
    endGame: () => void,
    constants: GameConstants
  ): AGame;
}
