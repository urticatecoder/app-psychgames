import { GameModel, PlayerModel } from "@dpg/types";
import { Socket } from "socket.io";
import { GameOne } from "./game-one";
import { GameTwo } from "./game-two";
import { Lobby } from "./lobby";

export class Game {
  players: Set<PlayerModel.ID>;

  private gameCount: number;
  private currentGame: GameInstance;
  private games: GameConstructor[] = [Lobby, GameOne, GameTwo];

  constructor(private room: Socket, private endGame: () => void) {
    this.players = new Set();
    this.gameCount = 0;
    this.currentGame = new this.games[this.gameCount](
      this.goToNextGame,
      this.room
    );
  }

  goToNextGame(): void {
    if (this.gameCount == this.games.length - 1) {
      this.endGame();
    }

    this.gameCount++;
    this.currentGame = new this.games[this.gameCount](
      this.goToNextGame,
      this.room
    );
  }

  submitAction(playerID: PlayerModel.ID, action: GameModel.Action): void {
    // TODO: validate playerID
    // TODO: validate action data
    this.currentGame.submitAction(playerID, action);
  }

  getState(): GameModel.State {
    const state: GameModel.State = {
      timestamp: new Date(),
      ...this.currentGame.getState(),
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
  new (goToNextGame: () => void, room: Socket): GameInstance;
}

export interface GameInstance {
  submitAction(playerID: PlayerModel.ID, action: GameModel.GameAction): void;
  getState(): GameModel.GameState;
}
