import { GameModel, PlayerModel, GameTwoModel } from "@dpg/types";
import { Injectable } from "@nestjs/common";
import { GameConstants } from "../game-manager/constants.js";
import { Game } from "../game-manager/game-logic/game.js";
import { GameFactory } from "./game-factory.js";

@Injectable()
export class GameFactoryService extends GameFactory {
  create(
    emitState: (player: PlayerModel.Id, state: GameModel.State) => void,
    endGame: () => void,
    constants: GameConstants,
    databaseStoreCallback: (selections: Map<string, Set<PlayerModel.Id> | GameTwoModel.TokenDistribution>, teamResults?: GameTwoModel.TeamResults, receiptTurnNumber?: Number) => void
  ): Game {
    return new Game(emitState, endGame, constants, databaseStoreCallback);
  }
}
