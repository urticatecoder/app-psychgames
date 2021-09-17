import { GameModel } from "@dpg/types";
import { Injectable } from "@nestjs/common";
import { Game } from "../game-manager/game-logic/game";
import { GameFactory } from "./game-factory";

@Injectable()
export class GameFactoryService extends GameFactory {
  create(
    emitState: (state: GameModel.State) => void,
    endGame: () => void
  ): Game {
    return new Game(emitState, endGame);
  }
}
