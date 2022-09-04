import { PLAYERS_PER_GAME } from "@dpg/constants";
import { GameModel, PlayerModel } from "@dpg/types";
import { WsException } from "@nestjs/websockets";
import { v4 as uuidv4 } from "uuid";
import { GameConstants } from "../constants.js";
import { Lobby } from "./lobby.js";

export abstract class AGame {
  abstract get constants(): GameConstants;
  abstract get players(): PlayerModel.Id[];
  abstract get playerData(): GameModel.Player[];
  abstract get playerMap(): Map<PlayerModel.Id, GameModel.Player>;

  abstract getState(player: PlayerModel.Id): GameModel.State;

  abstract submitAction(
    playerID: PlayerModel.Id,
    action: GameModel.Action
  ): void;

  abstract isJoinable(): boolean;

  abstract emitState(): void;

  abstract goToGame(game: GameInstance): void;
  abstract endGame(): void;
}

export class Game extends AGame {
  private currentGame: GameInstance;
  public playerMap: Map<PlayerModel.Id, GameModel.Player>;

  constructor(
    private emitStateCallback: (
      player: PlayerModel.Id,
      state: GameModel.State
    ) => void,
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
     *   new player is playing
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

    this.currentGame = new Lobby(this);
  }

  goToGame(game: GameInstance): void {
    this.currentGame = game;
  }

  submitAction(playerID: PlayerModel.Id, action: GameModel.Action): void {
    // TODO: validate playerID
    // TODO: validate action data
    this.currentGame.submitAction(playerID, action);
  }

  getState(player: PlayerModel.Id): GameModel.State {
    return this.makeState(this.currentGame.getState(player));
  }

  get players(): PlayerModel.Id[] {
    return [...this.playerMap.keys()];
  }

  get playerData(): GameModel.Player[] {
    return [...this.playerMap.values()];
  }

  emitState() {
    for (const player of this.players) {
      this.emitStateCallback(player, this.getState(player));
    }
  }

  isJoinable(): boolean {
    return this.currentGame instanceof Lobby;
  }

  endGame() {
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

  constructor(message: string, playerId: PlayerModel.Id) {
    super(`${playerId}: ${message}`);
    this.playerID = playerId;
  }
}

export interface GameInstance {
  submitAction(playerId: PlayerModel.Id, action: GameModel.GameAction): void;
  getState(player: PlayerModel.Id): GameModel.GameState;
}
