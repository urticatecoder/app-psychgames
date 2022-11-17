import { GameModel, PlayerModel, GameTwoModel } from "@dpg/types";
import { GameConstants } from "../game-manager/constants.js";
import { AGame } from "../game-manager/game-logic/game.js";

export abstract class GameFactory {
  abstract create(
    emitState: (player: PlayerModel.Id, state: GameModel.State) => void,
    endGame: () => void,
    constants: GameConstants,
    databaseStoreCallback: (selections: Map<string, Set<PlayerModel.Id> | GameTwoModel.TokenDistribution>, teamResults?: GameTwoModel.TeamResults, receiptTurnNumber?: Number) => void
  ): AGame;
}
