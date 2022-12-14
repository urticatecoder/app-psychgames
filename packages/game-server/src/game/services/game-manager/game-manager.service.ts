import { AppEvents } from "@dpg/constants";
import { GameModel, PlayerModel, GameTwoModel } from "@dpg/types";
import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { DefaultGameConstants } from "./constants.js";
import { v4 as uuidv4 } from "uuid";
import { GameFactory } from "../game-factory/game-factory.js";
import { AGame } from "./game-logic/game.js";
import mongoose from "mongoose";
import { GameOneDataModel, GameTwoDataModel } from "./database-models.js";
import { NONAME } from "dns";
import { stat } from "fs";

// TODO: test and clean up this mess; I was too tired on the first write
type GameID = string;
type SocketID = string;
type GameOneSelection = {selectedPlayers: Set<PlayerModel.Id>, decisionTime: number};
type GameTwoSelection = GameTwoModel.TokenDistribution & {decisionTime: number};

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

  attachPlayer(socketID: SocketID, playerID: PlayerModel.Id): boolean {
    const game = this.getPlayerGame(playerID);
    if (!game) return false;
    this.addPlayerToGame(socketID, playerID, game);
    return true;
  }

  attachSocket(
    socketID: SocketID,
    playerInfo?: PlayerModel.PlayerMetadata
  ): PlayerModel.Id {
    // TODO: Use metadata to join lobby
    for (const game of this.games) {
      if (!game.instance.isJoinable()) continue;
      const availablePlayerID = this.findAvailablePlayerID(game);
      if (availablePlayerID) {
        this.addPlayerToGame(socketID, availablePlayerID, game, playerInfo?.prolificId);
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
        (player: PlayerModel.Id, state: GameModel.State) =>
          this.emitPlayerStateTo(gameID, player, state),
        () => this.endGame(gameID),
        // Here is where we can change game parameters per game
        DefaultGameConstants,
        (selections: Map<string, GameOneSelection | GameTwoSelection>, teamResults?: GameTwoModel.TeamResults, receiptTurnNumber?: number) => 
          this.pushToDatabase(gameID, selections, teamResults, receiptTurnNumber),
        (inactivePlayersList: PlayerModel.Id[]) => this.handleBots(gameID, inactivePlayersList)
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

  private emitStateTo(filter: GameID | SocketID, state: GameModel.State): void {
    this.server?.to(filter).emit(AppEvents.STATE_UPDATE, state);
  }

  private emitPlayerStateTo(
    gameId: GameID,
    player: PlayerModel.Id,
    state: GameModel.State
  ): void {
    const game = this.getGameById(gameId);
    if (!game) {
      throw new Error("Game not found in state emit callback");
    }

    const socket = game.activePlayers.getR(player);
    if (!socket) {
      throw new Error("Could not find socket for requested player");
    }

    this.server?.to(socket).emit(AppEvents.STATE_UPDATE, state);
  }

  private getGameById(gameId: GameID) {
    return this.games.find((game) => game.id === gameId);
  }

  private getSocketGame(socketID: SocketID): ManagedGame | undefined {
    for (const game of this.games) {
      if (game.activePlayers.has(socketID)) return game;
    }
    return undefined;
  }

  private getPlayerGame(playerID: PlayerModel.Id): ManagedGame | undefined {
    for (const game of this.games) {
      if (game.instance.playerMap.has(playerID)) return game;
    }
    return undefined;
  }

  private getPlayerSocket(gameId: string, playerId: PlayerModel.Id): SocketID | undefined {
    let game = this.getGameById(gameId);
    let sockets = game?.activePlayers.keys();
    
    for (const key of sockets!) {
      if (game?.activePlayers.get(key) == playerId) {
        return key;
      }
    }

    return undefined;
  }

  private addPlayerToGame(
    socketID: SocketID,
    playerID: PlayerModel.Id,
    game: ManagedGame,
    prolificID?: string
  ) {
    // Sanity check
    if (!game.instance.playerMap.has(playerID)) {
      throw new Error(
        `attempted to add ${playerID} to game, but was not a valid player.`
      );
    }
    game.activePlayers.set(socketID, playerID);
    if (prolificID) {
      game.prolificMap.set(playerID, prolificID);
    }
    
    // join socket to game room
    this.server?.in(socketID).socketsJoin(game.id);
    // emit state
    this.emitStateTo(socketID, game.instance.getState(playerID));
  }

  private findAvailablePlayerID(game: ManagedGame): PlayerModel.Id | undefined {
    for (const player of game.instance.playerMap.keys()) {
      if (!game.activePlayers.hasR(player)) return player;
    }
    return undefined;
  }

  private handleBots(gameID: string, inactivePlayersList: PlayerModel.Id[]) {
    let managedGame = this.getGameById(gameID);

    if (!managedGame) {
      throw new Error(`Couldn't find managed game with ID ${gameID}`);
    }

    let game = managedGame.instance;
    let activePlayersList = game.players.filter((player) => {
      !inactivePlayersList.includes(player);
    });

    for (let i = 0; i < activePlayersList.length; i++) {
      managedGame.inactivityMap.set(activePlayersList[i], 0);
    }

    for (let i = 0; i < inactivePlayersList.length; i++) {
      let inactiveRounds = managedGame.inactivityMap.get(inactivePlayersList[i])!;
      managedGame.inactivityMap.set(inactivePlayersList[i], inactiveRounds + 1);

      // Kick the player if they were inactive for more than 5 (consecutive) rounds and are not already a bot.
      if (managedGame.activePlayers.has(inactivePlayersList[i]) && inactiveRounds + 1 > 5) {
        let socketId = this.getPlayerSocket(gameID, inactivePlayersList[i]);
        let socket = this.server?.sockets.sockets.get(<string> socketId);
        socket?.disconnect();
        this.discardSocket(<string> socketId);
      }
    }
  }

  private pushToDatabase(gameID: string, selections: Map<string, GameOneSelection | GameTwoSelection>, teamResults?: GameTwoModel.TeamResults, receiptTurnNumber?: number) {
    const managedGame = this.getGameById(gameID);
    if (!managedGame) {
      throw new Error(
        `attempted to push to database for gameID ${gameID}, but that is not a currently managed game`
      )
    }
    const experimentTime = managedGame.gameCreationTime;
    const game = managedGame.instance;
    const players = game.players;
    const activePlayersList = Array.from(managedGame.activePlayers.values());
    const botMap = new Map<PlayerModel.Id, string>();
    let botCount = 1;
    for (let i = 0; i < activePlayersList.length; i++) {
      if (!activePlayersList.includes(players[i])) {
        botMap.set(players[i], "bot" + botCount);
        botCount++;
      } else {
        botMap.set(players[i], "not bot");
      }
    }
    
    players.forEach(async (playerId) => {
      let state = game.getState(playerId);

      if (state.type == "game-one_state") {
        await GameOneDataModel.create({
          experimentID: managedGame.id,
          experimentStartTime: experimentTime,
          decisionTime: selections.get(playerId)?.decisionTime,
          roundStartTime: state.roundStartTime,
          roundEndTime: state.roundEndTime,
          playerID: playerId,
          prolificID: managedGame.prolificMap.get(playerId),
          turnNumber: state.round,
          selectedIDOne: Array.from((<GameOneSelection> selections.get(playerId)).selectedPlayers)[0] ? Array.from((<GameOneSelection> selections.get(playerId)).selectedPlayers)[0] : "none",
          selectedIDTwo: Array.from((<GameOneSelection> selections.get(playerId)).selectedPlayers)[1] ? Array.from((<GameOneSelection> selections.get(playerId)).selectedPlayers)[1] : "none",
          madeByBot: botMap.get(playerId) == "not bot"? false : true,
          oldLocation: state.bonusGroups[0].filter(player => player.id == playerId)[0].position,
          newLocation: state.bonusGroups[state.bonusGroups.length - 1].filter(player => player.id == playerId)[0].position,
          doubleBonusCount: state.bonusGroups.filter(group => {
            group.filter(player => {
              player.turnBonus != "double" && player.id == playerId
            }).length > 0
          }).length,
          tripleBonusCount: state.bonusGroups.filter(group => {
            group.filter(player => {
              player.turnBonus != "triple" && player.id == playerId
            }).length > 0
          }).length,
        })
      } else if (state.type == "game-two_state") {
        await GameTwoDataModel.create({
          experimentID: managedGame.id,
          experimentStartTime: experimentTime,
          decisionTime: selections.get(playerId)?.decisionTime,
          roundStartTime: state.roundStartTime,
          roundEndTime: state.roundEndTime,
          playerID: playerId,
          prolificID: managedGame.prolificMap.get(playerId),
          turnNumber: state.round,
          keepTokens: (<GameTwoSelection> selections.get(playerId)!).keep,
          investTokens: (<GameTwoSelection> selections.get(playerId)!).invest,
          competeTokens: (<GameTwoSelection> selections.get(playerId)!).compete,
          investPayoff: state.investCoefficient,
          competePayoff: state.competeCoefficient,
          madeByBot: botMap.get(playerId) == "not bot"? false : true,
          receiptTurnNum: receiptTurnNumber,
          teamKeepTotal: state.winners.includes(playerId) ? teamResults?.winnerTeam.totalTokenDistribution.keep : teamResults?.loserTeam.totalTokenDistribution.keep,
          teamInvestTotal: state.winners.includes(playerId) ? teamResults?.winnerTeam.totalTokenDistribution.invest : teamResults?.loserTeam.totalTokenDistribution.invest,
          teamCompeteTotal: state.winners.includes(playerId) ? teamResults?.winnerTeam.totalTokenDistribution.compete : teamResults?.loserTeam.totalTokenDistribution.compete,
          teamInvestPayoff: state.winners.includes(playerId) ? teamResults?.winnerTeam.investBonus : teamResults?.loserTeam.investBonus,
          teamCompetePenalty: state.winners.includes(playerId) ? teamResults?.winnerTeam.competePenalty : teamResults?.loserTeam.competePenalty,
        })
      }
    })

  }
}

export class ManagedGame {
  instance: AGame;
  humanID: string;
  gameCreationTime: string | Date;
  id: string;
  activePlayers: OneToOneMap<SocketID, PlayerModel.Id>;
  inactivityMap: Map<PlayerModel.Id, number>; // Tracks the number of consecutive rounds each player has been inactive
  prolificMap: Map<PlayerModel.Id, string>;

  constructor(game: AGame, id: string) {
    this.instance = game;
    this.id = id;
    this.activePlayers = new OneToOneMap();
    // TODO: create human-readable ids
    this.humanID = "";
    this.gameCreationTime = new Date();
    this.inactivityMap = new Map<PlayerModel.Id, number>();
    this.initializeInactivityMap();
    this.prolificMap = new Map<PlayerModel.Id, string>();
  }

  private initializeInactivityMap() {
    this.instance.players.forEach((playerId) => {
      this.inactivityMap.set(playerId, 0);
    });
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
