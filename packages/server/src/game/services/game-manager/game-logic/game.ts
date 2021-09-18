import { PLAYERS_PER_GAME } from "@dpg/constants";
import { GameModel, PlayerModel } from "@dpg/types";
import { v4 as uuidv4 } from "uuid";
import { GameOne } from "./game-one";
import { GameTwo } from "./game-two";
import { Lobby } from "./lobby";

export abstract class AGame {
  abstract getPlayers(): Set<PlayerModel.ID>;

  abstract submitAction(
    playerID: PlayerModel.ID,
    action: GameModel.Action
  ): void;

  abstract getState(): GameModel.State;

  abstract isJoinable(): boolean;
}
export class Game extends AGame {
  private gameCount: number;
  private currentGame: GameInstance;
  private games: GameConstructor[] = [Lobby, GameOne, GameTwo];
  private players: Set<PlayerModel.ID>;

  constructor(
    private emitState: (state: GameModel.State) => void,
    private endGame: () => void
  ) {
    super();
    /**
     * Generate player IDs
     *
     * Why do we generate player IDs here?
     * If we had `addPlayer()` and `removePlayer()` functions to
     * add/remove player IDs, we would have to keep track of bots vs
     * humans, generate bot IDs at an appropriate time, and the logic
     * to change players mid-game would be difficult since player IDs need
     * to be consistent for state purposes.
     *
     * Instead of doing this, we generate IDs at game initialization, and
     * allow server connections to attach/detach from a specific ID.
     *
     * This introduces a minor security risk; namely, if we change a player
     * mid-game, the old client still has the ID of the new player. This is
     * not especially relevant because:
     * - We currently don't even support mid-game player changes
     * - As long as we don't allow two players with the same ID to connect at
     *   once, the old player won't be able to initiate a connection while the
     *   old player is playing
     * - Allowing an old player to join in if the new one disconnects might even
     *   be beneficial behavior
     *
     * Note that replacing players mid-game breaks the consistency between ID
     * and player metadata. Keep this in mind during feature implementation.
     * We would probably only want to support player replacement during random
     * lobbies with no player metadata.
     */
    this.players = new Set<PlayerModel.ID>();
    for (let i = 0; i < PLAYERS_PER_GAME; i++) {
      this.players.add(uuidv4());
    }

    this.gameCount = 0;
    this.currentGame = new this.games[this.gameCount](
      (state: GameModel.GameState) => this.emitState(this.makeState(state)),
      this.goToNextGame
    );
  }

  private goToNextGame(): void {
    this.gameCount++;
    this.currentGame = new this.games[this.gameCount](
      (state: GameModel.GameState) => this.emitState(this.makeState(state)),
      this.goToNextGame
    );
  }

  getPlayers(): Set<PlayerModel.ID> {
    return this.players;
  }

  submitAction(playerID: PlayerModel.ID, action: GameModel.Action): void {
    // TODO: validate playerID
    // TODO: validate action data
    this.currentGame.submitAction(playerID, action);
  }

  getState(): GameModel.State {
    return this.makeState(this.currentGame.getState());
  }

  isJoinable(): boolean {
    return this.gameCount === 0;
  }

  private makeState(gameState: GameModel.GameState) {
    const state: GameModel.State = {
      timestamp: new Date(),
      ...gameState,
    };

    return state;
  }
}

export class GameError extends Error {
  playerID: PlayerModel.ID;

  constructor(message: string, playerID: PlayerModel.ID) {
    super(`${playerID}: ${message}`);
    this.playerID = playerID;
  }
}

export interface GameConstructor {
  new (
    emitState: (state: GameModel.GameState) => void,
    goToNextGame: () => void
  ): GameInstance;
}

export interface GameInstance {
  submitAction(playerID: PlayerModel.ID, action: GameModel.GameAction): void;
  getState(): GameModel.GameState;
}
