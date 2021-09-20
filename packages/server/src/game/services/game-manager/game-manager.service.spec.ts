import { AppEvents, PLAYERS_PER_GAME } from "@dpg/constants";
import { GameModel } from "@dpg/types";
import { Test, TestingModule } from "@nestjs/testing";
import { Server as RawServer } from "socket.io";
import { GameFactory } from "../game-factory/game-factory.js";
import { DefaultGameConstants, GameConstants } from "./constants.js";
import { AGame } from "./game-logic/game.js";
import { GameManagerService, ManagedGame } from "./game-manager.service.js";

const serverMocks: any = {
  to: jest.fn(() => serverMocks),
  in: jest.fn(() => serverMocks),
  emit: jest.fn(),
  socketsJoin: jest.fn(),
  disconnectSockets: jest.fn(),
};

const serverDec = jest.fn(() => {
  return serverMocks;
});

const Server = <typeof RawServer & typeof serverDec>(<unknown>serverDec);

const gameState = {
  prop: "value",
};

const testPlayerMap = new Map([
  [
    "1",
    {
      id: "1",
      avatar: 0,
    },
  ],
  [
    "2",
    {
      id: "2",
      avatar: 0,
    },
  ],
  [
    "3",
    {
      id: "3",
      avatar: 0,
    },
  ],
  [
    "4",
    {
      id: "4",
      avatar: 0,
    },
  ],
  [
    "5",
    {
      id: "5",
      avatar: 0,
    },
  ],
  [
    "6",
    {
      id: "6",
      avatar: 0,
    },
  ],
]);

const gameMocks = {
  playerMap: testPlayerMap,
  players: [...testPlayerMap.values()],
  constants: DefaultGameConstants,
  state: <GameModel.State>(<unknown>gameState),
  submitAction: jest.fn(),
  emitState: jest.fn(),
  goToNextGame: jest.fn(),
  isJoinable: jest.fn(() => true),
};

const Game = <AGame>gameMocks;

let emitCallback: (state: any) => void;
let endCallback: () => void;

beforeEach(() => {
  Server.mockClear();

  serverMocks.to.mockClear();
  serverMocks.in.mockClear();
  serverMocks.emit.mockClear();
  serverMocks.socketsJoin.mockClear();
  serverMocks.disconnectSockets.mockClear();

  gameMocks.submitAction.mockClear();
  gameMocks.emitState.mockClear();
  gameMocks.goToNextGame.mockClear();
  gameMocks.isJoinable.mockClear();
});

describe("GameManagerService", () => {
  let gameM: GameManagerService;

  beforeEach(async () => {
    const gameFactory: GameFactory = {
      create: (
        emitState: (state: GameModel.State) => void,
        endGame: () => void,
        constants: GameConstants
      ) => {
        emitCallback = emitState;
        endCallback = endGame;
        return Game;
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
    gameM.setServer(new Server());
  });

  it("is defined", () => {
    expect(gameM).toBeDefined();
  });

  describe("adding players/games", () => {
    const expectSocketAdded = (socket: string, game: ManagedGame) => {
      expect(game.activePlayers.keys()).toContain(socket);
      expect(serverMocks.in).toHaveBeenCalledWith(socket);
      expect(serverMocks.socketsJoin).toHaveBeenCalledWith(game.id);
      expect(serverMocks.emit).toHaveBeenCalledWith(
        AppEvents.STATE_UPDATE,
        gameState
      );
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

    const expectGameStateEmitted = (state: any, game: ManagedGame) => {
      expect(serverMocks.to).toHaveBeenLastCalledWith(game.id);
      expect(serverMocks.emit).toHaveBeenLastCalledWith(
        AppEvents.STATE_UPDATE,
        state
      );
    };

    it("emits state on callback", () => {
      gameM.attachSocket("socket-one");
      const game = gameM.getGames()[0];
      emitCallback(testState);
      expectGameStateEmitted(testState, game);
    });

    it("emits state to correct game", () => {
      const players = PLAYERS_PER_GAME + 1;
      gameM.attachSocket("socket-1");
      const gameOneCallback = emitCallback;
      for (let i = 1; i < players; i++) {
        gameM.attachSocket(`socket-${i}`);
      }
      const gameTwoCallback = emitCallback;

      const game1 = gameM.getGames()[0];
      const state1 = {
        game: "1",
      };
      gameOneCallback(state1);
      expectGameStateEmitted(state1, game1);

      const game2 = gameM.getGames()[1];
      const state2 = {
        game: "2",
      };
      gameTwoCallback(state2);
      expectGameStateEmitted(state2, game2);
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

      expect(serverMocks.in).toHaveBeenCalledWith(game.id);
      expect(serverMocks.disconnectSockets).toHaveBeenCalled();
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
