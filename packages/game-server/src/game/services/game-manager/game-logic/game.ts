import { PLAYERS_PER_GAME } from "@dpg/constants";
import { GameModel, PlayerModel } from "@dpg/types";
import { WsException } from "@nestjs/websockets";
import { GameConstants } from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import { GameOne } from "./game-one.js";
import { GameTwo } from "./game-two.js";
import { Lobby } from "./lobby.js";

export abstract class AGame {
  abstract get constants(): GameConstants;
  abstract get players(): PlayerModel.Id[];
  abstract get playerData(): GameModel.Player[];
  abstract get playerMap(): Map<PlayerModel.Id, GameModel.Player>;
  abstract get state(): GameModel.State;

  abstract submitAction(
    playerID: PlayerModel.Id,
    action: GameModel.Action
  ): void;

  abstract isJoinable(): boolean;

  abstract emitState(): void;

  abstract goToNextGame(initialState?: GameModel.GameState): void;
}

export class Game extends AGame {
  private gameCount: number;
  private currentGame: GameInstance;
  private games: GameConstructor[] = [Lobby, GameOne, GameTwo];
  public playerMap: Map<PlayerModel.Id, GameModel.Player>;

  constructor(
    private emitStateCallback: (state: GameModel.State) => void,
    private destroyGame: () => void,
    public constants: GameConstants
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
    this.playerMap = new Map();
    for (let i = 0; i < PLAYERS_PER_GAME; i++) {
      const id = uuidv4();
      this.playerMap.set(id, {
        id,
        avatar: 0,
      });
    }

    this.gameCount = 0;
    this.currentGame = new this.games[this.gameCount](this, undefined);
  }

  goToNextGame(initialState?: GameModel.GameState): void {
    this.gameCount++;
    if (this.gameCount === this.games.length) {
      this.endGame();
      return;
    }

    this.currentGame = new this.games[this.gameCount](this, initialState);
  }

  submitAction(playerID: PlayerModel.Id, action: GameModel.Action): void {
    // TODO: validate playerID
    // TODO: validate action data
    this.currentGame.submitAction(playerID, action);
  }

  get state(): GameModel.State {
    return this.makeState(this.currentGame.state);
  }

  get players(): PlayerModel.Id[] {
    return [...this.playerMap.keys()];
  }

  get playerData(): GameModel.Player[] {
    return [...this.playerMap.values()];
  }

  emitState() {
    this.emitStateCallback(this.state);
  }

  isJoinable(): boolean {
    return this.gameCount === 0;
  }

  private endGame() {
    // TODO: do cleanup, database stuff, etc. here
    this.destroyGame();
  }

  private makeState(gameState: GameModel.GameState) {
    const state: GameModel.State = {
      timestamp: new Date(),
      playerData: this.playerData,
      ...gameState,
    };

    return state;
  }
}

export class GameError extends WsException {
  playerID: PlayerModel.Id;

  constructor(message: string, playerID: PlayerModel.Id) {
    super(`${playerID}: ${message}`);
    this.playerID = playerID;
  }
}

export interface GameConstructor {
  new (game: AGame, initialState?: GameModel.GameState): GameInstance;
}

export interface GameInstance {
  submitAction(playerID: PlayerModel.Id, action: GameModel.GameAction): void;
  get state(): GameModel.GameState;
}
