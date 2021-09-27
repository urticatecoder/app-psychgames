import { GameModel, GameOneModel, PlayerModel } from "@dpg/types";
import { Game } from "./game";
import { GameOne } from "./game-one";

jest.mock("./game");
jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe("game one", () => {
  let gameOne: GameOne;
  let game: Game;

  beforeEach(() => {
    game = <Game>new (<any>Game)();
    gameOne = new GameOne(game);
  });

  it("emits state to players on creation", () => {
    expect(game.emitState).toBeCalledTimes(1);
  });

  it("emits state to players after timeout", () => {
    jest.clearAllMocks();
    expect(game.emitState).not.toBeCalled();
    jest.runOnlyPendingTimers();
    expect(game.emitState).toHaveBeenCalledTimes(1);
  });

  describe("bot actions", () => {
    it.skip("makes player movements when no action is submitted", () => {
      jest.runOnlyPendingTimers();
      expect(
        gameOne.state.playerPositions.filter(
          (position) => position.position === 0
        )
      ).not.toHaveLength(gameOne.state.playerPositions.length);
    });
  });

  describe("game rounds", () => {
    const getPlayerPosition: (
      player: PlayerModel.ID
    ) => GameOneModel.PlayerPosition = (player) =>
      gameOne.state.playerPositions.find(
        (position) => position.player === player
      )!;

    describe("triple/none", () => {
      beforeEach(() => {
        const buildAction: (p: PlayerModel.ID[]) => GameOneModel.Turn = (
          selectedPlayers
        ) => ({
          type: "game-one--turn",
          round: 0,
          playersSelected: selectedPlayers,
        });

        gameOne.submitAction("1", buildAction(["2", "3"]));
        gameOne.submitAction("2", buildAction(["1", "3"]));
        gameOne.submitAction("3", buildAction(["1", "2"]));

        gameOne.submitAction("4", buildAction([]));
        gameOne.submitAction("5", buildAction([]));
        gameOne.submitAction("6", buildAction([]));

        jest.runOnlyPendingTimers();
      });

      it("moves trio upwards", () => {
        expect(getPlayerPosition("1").position).toBeGreaterThan(0);
        expect(getPlayerPosition("2").position).toBeGreaterThan(0);
        expect(getPlayerPosition("3").position).toBeGreaterThan(0);
      });

      it("moves others downwards", () => {
        expect(getPlayerPosition("4").position).toBeLessThan(0);
        expect(getPlayerPosition("5").position).toBeLessThan(0);
        expect(getPlayerPosition("6").position).toBeLessThan(0);
      });

      it("assigns bonuses", () => {
        expect(getPlayerPosition("1").previousTurnBonus).toEqual("triple");
        expect(getPlayerPosition("2").previousTurnBonus).toEqual("triple");
        expect(getPlayerPosition("3").previousTurnBonus).toEqual("triple");

        expect(getPlayerPosition("4").previousTurnBonus).toEqual("none");
        expect(getPlayerPosition("5").previousTurnBonus).toEqual("none");
        expect(getPlayerPosition("6").previousTurnBonus).toEqual("none");
      });
    });

    describe("triple/duo/single", () => {
      beforeEach(() => {
        const buildAction: (p: PlayerModel.ID[]) => GameOneModel.Turn = (
          selectedPlayers
        ) => ({
          type: "game-one--turn",
          round: 0,
          playersSelected: selectedPlayers,
        });

        gameOne.submitAction("1", buildAction(["2", "3"]));
        gameOne.submitAction("2", buildAction(["1", "3"]));
        gameOne.submitAction("3", buildAction(["1", "2"]));

        gameOne.submitAction("4", buildAction(["5", "6"]));
        gameOne.submitAction("5", buildAction(["4"]));
        gameOne.submitAction("6", buildAction([]));

        jest.runOnlyPendingTimers();
      });

      it("assigns bonuses", () => {
        expect(getPlayerPosition("1").previousTurnBonus).toEqual("triple");
        expect(getPlayerPosition("2").previousTurnBonus).toEqual("triple");
        expect(getPlayerPosition("3").previousTurnBonus).toEqual("triple");

        expect(getPlayerPosition("4").previousTurnBonus).toEqual("double");
        expect(getPlayerPosition("5").previousTurnBonus).toEqual("double");
        expect(getPlayerPosition("6").previousTurnBonus).toEqual("single");
      });

      it("puts single player at the bottom", () => {
        expect(getPlayerPosition("6").position).toEqual(
          gameOne.state.playerPositions
            .map((pos) => pos.position)
            .sort((a, b) => a - b)[0]
        );
      });
    });
  });
});
