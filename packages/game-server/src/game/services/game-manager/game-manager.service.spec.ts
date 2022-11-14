import { AppEvents, PLAYERS_PER_GAME } from "@dpg/constants";
import { GameModel, PlayerModel, GameTwoModel } from "@dpg/types";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "socket.io";
import { GameFactory } from "../game-factory/game-factory.js";
import { GameConstants } from "./constants.js";
import { Game } from "./game-logic/game.js";
import { GameManagerService, ManagedGame } from "./game-manager.service.js";

jest.mock("./game-logic/game.js");

let emitCallback: (player: PlayerModel.Id, state: any) => void;
let endCallback: () => void;
let server: Server;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GameManagerService", () => {
  let gameM: GameManagerService;

  beforeEach(async () => {
    const gameFactory: GameFactory = {
      create: (
        emitState: (player: PlayerModel.Id, state: GameModel.State) => void,
        endGame: () => void,
        constants: GameConstants,
        databaseStore: (selections: Map<string, Set<PlayerModel.Id> | GameTwoModel.TokenDistribution>, teamResults?: GameTwoModel.TeamResults) => void
      ) => {
        emitCallback = emitState;
        endCallback = endGame;
        return new Game(emitState, endGame, constants, databaseStore);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameManagerService,
        {
          provide: GameFactory,
          useValue: gameFactory,
        },
      ],
    }).compile();

    gameM = module.get<GameManagerService>(GameManagerService);
    server = new Server();
    gameM.setServer(server);
  });

  it("is defined", () => {
    expect(gameM).toBeDefined();
  });

  describe("adding players/games", () => {
    const expectSocketAdded = (socket: string, game: ManagedGame) => {
      expect(game.activePlayers.keys()).toContain(socket);
      expect(server.in).toHaveBeenCalledWith(socket);
      expect(server.socketsJoin).toHaveBeenCalledWith(game.id);
      expect(server.emit).toHaveBeenCalledWith(AppEvents.STATE_UPDATE, {
        prop: "value",
      });
    };

    it("joins the first socket to a new game", () => {
      gameM.attachSocket("socket-id");
      expect(gameM.getGames()).toHaveLength(1);
      const game = gameM.getGames()[0];
      expectSocketAdded("socket-id", game);
    });

    it("joins sockets to existing games", () => {
      gameM.attachSocket("socket-one");
      gameM.attachSocket("socket-two");
      expect(gameM.getGames()).toHaveLength(1);
      const game = gameM.getGames()[0];
      expectSocketAdded("socket-one", game);
      expectSocketAdded("socket-two", game);
      // sockets should connect to different IDs
      expect(game.activePlayers.get("socket-one")).not.toEqual(
        game.activePlayers.get("socket-two")
      );
    });

    it("creates more games when existing ones are full", () => {
      const players = PLAYERS_PER_GAME + 2;
      const gameOnePlayers = PLAYERS_PER_GAME;

      for (let i = 0; i < players; i++) {
        gameM.attachSocket(`socket-${i}`);
      }

      expect(gameM.getGames()).toHaveLength(2);

      const game1 = gameM.getGames()[0];
      for (let i = 0; i < gameOnePlayers; i++) {
        expectSocketAdded(`socket-${i}`, game1);
      }

      const game2 = gameM.getGames()[1];
      for (let i = gameOnePlayers; i < players; i++) {
        expectSocketAdded(`socket-${i}`, game2);
      }
    });
  });

  describe("state", () => {
    const testState = {
      doThe: "jiggy",
    };

    const expectSocketStateEmitted = (socket: string, state: any) => {
      expect(server.to).toHaveBeenLastCalledWith(socket);
      expect(server.emit).toHaveBeenLastCalledWith(
        AppEvents.STATE_UPDATE,
        state
      );
    };

    it("emits state on callback", () => {
      gameM.attachSocket("socket-one");
      const game = gameM.getGames()[0];
      const player = game.activePlayers.get("socket-one")!;
      emitCallback(player, testState);
      expectSocketStateEmitted("socket-one", testState);
    });

    it("emits state to correct player", () => {
      const players = PLAYERS_PER_GAME + 1;
      const player1 = gameM.attachSocket("socket-1");
      const gameOneCallback = emitCallback;
      for (let i = 2; i < players; i++) {
        gameM.attachSocket(`socket-${i}`);
      }
      const socket2 = `socket-${players}`;
      const player2 = gameM.attachSocket(socket2);
      const gameTwoCallback = emitCallback;

      const state1 = {
        game: "1",
      };
      gameOneCallback(player1, state1);
      expectSocketStateEmitted("socket-1", state1);

      const state2 = {
        game: "2",
      };
      gameTwoCallback(player2, state2);
      expectSocketStateEmitted(socket2, state2);

      // Emitting state to a player not in the game should fail
      expect(() => gameOneCallback(socket2, state1)).toThrow();
      expect(() => gameTwoCallback("socket-1", state2)).toThrow();
    });
  });

  describe("removing players/games", () => {
    it("removes player from game on discard", () => {
      gameM.attachSocket("socket-one");
      gameM.attachSocket("socket-two");

      gameM.discardSocket("socket-one");
      const game = gameM.getGames()[0];

      expect(game.activePlayers.keys()).not.toContain("socket-one");
      expect(game.activePlayers.keys()).toContain("socket-two");
    });

    it("disconnects sockets on game end", () => {
      gameM.attachSocket("socket-one");
      gameM.attachSocket("socket-two");
      const game = gameM.getGames()[0];
      endCallback();

      expect(server.in).toHaveBeenCalledWith(game.id);
      expect(server.disconnectSockets).toHaveBeenCalled();
    });

    it("removes game on end callback", () => {
      gameM.attachSocket("socket-one");
      gameM.attachSocket("socket-two");
      endCallback();

      expect(gameM.getGames()).toHaveLength(0);
    });

    it("only ends called game", () => {
      const players = PLAYERS_PER_GAME + 1;
      gameM.attachSocket("socket-1");
      const gameOneCallback = endCallback;
      const gameOne = gameM.getGames()[0];
      for (let i = 1; i < players; i++) {
        gameM.attachSocket(`socket-${i}`);
      }
      const gameTwoCallback = endCallback;

      expect(gameM.getGames()).toHaveLength(2);
      gameOneCallback();
      expect(gameM.getGames()).toHaveLength(1);
      expect(gameM.getGames()).not.toContain(gameOne);
      gameTwoCallback();
      expect(gameM.getGames()).toHaveLength(0);
    });
  });

  // TODO: Test mixture of adding/removing players
  // TODO: Test reattaching players to game
});
