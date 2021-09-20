import { AppEvents } from "@dpg/constants";
import { GameModel, PlayerModel } from "@dpg/types";
import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { DefaultGameConstants } from "src/game/constants.js";
import { v4 as uuidv4 } from "uuid";
import { GameFactory } from "../game-factory/game-factory.js";
import { AGame } from "./game-logic/game.js";

// TODO: test and clean up this mess; I was too tired on the first write
type GameID = string;
type SocketID = string;
@Injectable()
export class GameManagerService {
  private games: ManagedGame[];
  private server: Server | null;

  constructor(private gameFactory: GameFactory) {
    this.games = [];
    this.server = null;
  }

  setServer(server: Server): void {
    this.server = server;
  }

  attachPlayer(socketID: SocketID, playerID: PlayerModel.ID): boolean {
    const game = this.getPlayerGame(playerID);
    if (!game) return false;
    this.addPlayerToGame(socketID, playerID, game);
    return true;
  }

  attachSocket(
    socketID: SocketID,
    playerInfo?: PlayerModel.PlayerMetadata
  ): PlayerModel.ID {
    // TODO: Use metadata to join lobby
    for (const game of this.games) {
      if (!game.instance.isJoinable()) continue;
      const availablePlayerID = this.findAvailablePlayerID(game);
      if (availablePlayerID) {
        this.addPlayerToGame(socketID, availablePlayerID, game);
        return availablePlayerID;
      }
    }
    // no game available; create new one
    const game = this.createGame();
    const playerID = this.findAvailablePlayerID(game)!;
    this.addPlayerToGame(socketID, playerID, game);
    return playerID;
  }

  /**
   * Remove an *already disconnected* socket from game info.
   * This method *does not* disconnect sockets and should only be called
   * on disconnect.
   * @param socketID
   */
  discardSocket(socketID: SocketID) {
    for (const game of this.games) {
      game.activePlayers.delete(socketID);
    }
  }

  private createGame(): ManagedGame {
    const gameID = uuidv4();
    const newGame = new ManagedGame(
      this.gameFactory.create(
        (state: GameModel.State) => this.emitStateTo(gameID, state),
        () => this.endGame(gameID),
        // Here is where we can change game parameters per game
        DefaultGameConstants
      ),
      gameID
    );
    this.games.push(newGame);
    return newGame;
  }

  submitAction(socketID: SocketID, action: GameModel.Action) {
    const game = this.getSocketGame(socketID);
    const playerID = game?.activePlayers.get(socketID);
    if (!game || !playerID) {
      throw new Error(
        `Attempted to submit action for socket ${socketID}, but an associated game was not found`
      );
    }

    game.instance.submitAction(playerID, action);
  }

  getGames(): ManagedGame[] {
    return this.games;
  }

  endGame(gameID: GameID) {
    const game = this.games.find((game: ManagedGame) => game.id === gameID);
    if (!game) {
      throw new Error(
        `attempted to end game ${gameID} but game was not found.`
      );
    }

    this.server?.in(gameID).disconnectSockets();
    this.games = this.games.filter((game: ManagedGame) => game.id !== gameID);
  }

  private emitStateTo(
    filter: GameID | PlayerModel.ID,
    state: GameModel.State
  ): void {
    this.server?.to(filter).emit(AppEvents.STATE_UPDATE, state);
  }

  private getSocketGame(socketID: SocketID): ManagedGame | undefined {
    for (const game of this.games) {
      if (game.activePlayers.has(socketID)) return game;
    }
    return undefined;
  }

  private getPlayerGame(playerID: PlayerModel.ID): ManagedGame | undefined {
    for (const game of this.games) {
      if (game.instance.getPlayers().has(playerID)) return game;
    }
    return undefined;
  }

  private addPlayerToGame(
    socketID: SocketID,
    playerID: PlayerModel.ID,
    game: ManagedGame
  ) {
    // Sanity check
    if (!game.instance.getPlayers().has(playerID)) {
      throw new Error(
        `attempted to add ${playerID} to game, but was not a valid player.`
      );
    }
    game.activePlayers.set(socketID, playerID);
    // join socket to game room
    this.server?.in(socketID).socketsJoin(game.id);
    // emit state
    this.emitStateTo(socketID, game.instance.getState());
  }

  private findAvailablePlayerID(game: ManagedGame): PlayerModel.ID | undefined {
    for (const player of game.instance.getPlayers()) {
      if (!game.activePlayers.hasR(player)) return player;
    }
    return undefined;
  }
}

export class ManagedGame {
  instance: AGame;
  humanID: string;
  id: string;
  activePlayers: OneToOneMap<SocketID, PlayerModel.ID>;

  constructor(game: AGame, id: string) {
    this.instance = game;
    this.id = id;
    this.activePlayers = new OneToOneMap();
    // TODO: create human-readable ids
    this.humanID = "";
  }
}

class OneToOneMap<A, B> {
  private aMap: Map<A, B>;
  private bMap: Map<B, A>;

  constructor() {
    this.aMap = new Map();
    this.bMap = new Map();
  }

  set(a: A, b: B) {
    this.aMap.set(a, b);
    this.bMap.set(b, a);
  }

  get(a: A): B | undefined {
    return this.aMap.get(a);
  }

  getR(b: B): A | undefined {
    return this.bMap.get(b);
  }

  has(a: A): boolean {
    return this.aMap.has(a);
  }

  hasR(b: B): boolean {
    return this.bMap.has(b);
  }

  delete(a: A): boolean {
    const b = this.aMap.get(a);
    if (!b) return false;
    this.aMap.delete(a);
    this.bMap.delete(b);
    return true;
  }

  deleteR(b: B): boolean {
    const a = this.bMap.get(b);
    if (!a) return false;
    this.bMap.delete(b);
    this.aMap.delete(a);
    return true;
  }

  keys(): IterableIterator<A> {
    return this.aMap.keys();
  }

  values(): IterableIterator<B> {
    return this.bMap.keys();
  }
}
