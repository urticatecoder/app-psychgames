import { GameModel } from "@dpg/types";
import { Injectable } from "@nestjs/common";
import { GameConstants } from "src/game/constants.js";
import { Game } from "../game-manager/game-logic/game.js";
import { GameFactory } from "./game-factory.js";

@Injectable()
export class GameFactoryService extends GameFactory {
  create(
    emitState: (state: GameModel.State) => void,
    endGame: () => void,
    constants: GameConstants
  ): Game {
    return new Game(emitState, endGame, constants);
  }
}
