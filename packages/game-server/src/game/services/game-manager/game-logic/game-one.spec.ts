import { PLAYERS_PER_GAME } from "@dpg/constants";
import { GameOneModel, PlayerModel } from "@dpg/types";
import { Game } from "./game.js";
import { GameOne } from "./game-one.js";

jest.mock("./game");
jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe("game one", () => {
  let gameOne: GameOne;
  let game: Game;

  const playerPositions = (gameOne: GameOne) =>
    gameOne.state.bonusGroups[gameOne.state.bonusGroups.length - 1];

  const getPlayerPosition: (
    player: PlayerModel.Id
  ) => GameOneModel.PlayerPosition = (player) =>
    playerPositions(gameOne).find((position) => position.id === player)!;

  const maxBonus: (player: PlayerModel.Id) => GameOneModel.TurnBonus = (
    player
  ) => {
    const orderedBonuses: GameOneModel.TurnBonus[] = [
      "none",
      "single",
      "double",
      "triple",
    ];
    return gameOne.state.bonusGroups.reduce(
      (max: GameOneModel.TurnBonus, group) => {
        const playerBonus = group.find(
          (position) => position.id === player
        )?.turnBonus;
        if (!playerBonus) {
          return max;
        }
        const bonusIndex = Math.max(
          orderedBonuses.indexOf(playerBonus),
          orderedBonuses.indexOf(max)
        );
        return orderedBonuses[bonusIndex];
      },
      "none"
    );
  };

  const buildAction: (p: PlayerModel.Id[]) => GameOneModel.Turn = (
    selectedPlayers
  ) => ({
    type: "game-one_turn",
    round: 0,
    playersSelected: selectedPlayers,
  });

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
    it("makes player movements when no action is submitted", () => {
      jest.runOnlyPendingTimers();
      expect(
        playerPositions(gameOne).filter((position) => position.position === 0)
      ).not.toHaveLength(PLAYERS_PER_GAME);
    });

    it.skip("selects two players that are not itself", () => {
      // TODO: Implement history
    });
  });

  describe("bonus group structure", () => {
    const hasPreviousFirst = (gameOne: GameOne) =>
      gameOne.state.bonusGroups.length === PLAYERS_PER_GAME &&
      gameOne.state.bonusGroups[0].every(
        (pos) => pos.position === 0 && pos.turnBonus === "none"
      );

    const hasNormalizedLast = (gameOne: GameOne) =>
      gameOne.state.bonusGroups.length === PLAYERS_PER_GAME &&
      gameOne.state.bonusGroups[gameOne.state.bonusGroups.length - 1].every(
        (pos) => pos.turnBonus === "none"
      );

    const isWellFormed = (gameOne: GameOne) =>
      hasPreviousFirst(gameOne) && hasNormalizedLast(gameOne);

    const hasSingleBonuses = (gameOne: GameOne, numBonuses: number) => {
      const singleBonus = gameOne.state.bonusGroups[1];
      expect(singleBonus.every((pos) => pos.turnBonus === "single"));
      expect(singleBonus).toHaveLength(numBonuses);
    };

    describe("no selections", () => {
      beforeEach(() => {
        gameOne.submitAction("1", buildAction([]));
        gameOne.submitAction("2", buildAction([]));
        gameOne.submitAction("3", buildAction([]));
        gameOne.submitAction("4", buildAction([]));
        gameOne.submitAction("5", buildAction([]));
        gameOne.submitAction("6", buildAction([]));

        jest.runOnlyPendingTimers();

        expect(isWellFormed(gameOne));
      });

      it("only has start and normalization", () => {
        expect(gameOne.state.bonusGroups).toHaveLength(2);
      });
    });

    describe("single bonuses", () => {
      beforeEach(() => {
        gameOne.submitAction("1", buildAction(["2", "3"]));
        gameOne.submitAction("2", buildAction(["3", "4"]));
        gameOne.submitAction("3", buildAction(["4", "5"]));

        gameOne.submitAction("4", buildAction(["5", "6"]));
        gameOne.submitAction("5", buildAction(["6", "1"]));
        gameOne.submitAction("6", buildAction(["1", "2"]));

        jest.runOnlyPendingTimers();

        expect(isWellFormed(gameOne));
      });

      it("only has single bonuses", () => {
        expect(gameOne.state.bonusGroups).toHaveLength(3);
      });

      it("has single bonuses", () => hasSingleBonuses(gameOne, 6));
    });

    describe("double bonuses", () => {
      beforeEach(() => {
        /**
         * Creates the following double pairs:
         * (1,2)
         * (1,3)
         * (3,4)
         * (4,5)
         * (5,6)
         */
        gameOne.submitAction("1", buildAction(["2", "3"]));
        gameOne.submitAction("2", buildAction(["1"]));
        gameOne.submitAction("3", buildAction(["1", "4"]));

        gameOne.submitAction("4", buildAction(["3", "5"]));
        gameOne.submitAction("5", buildAction(["4", "6"]));
        gameOne.submitAction("6", buildAction(["5"]));

        jest.runOnlyPendingTimers();

        expect(isWellFormed(gameOne));
      });

      it("has single bonuses", () => hasSingleBonuses(gameOne, 6));

      it("has appropriate double bonuses", () => {
        const doubleBonuses = gameOne.state.bonusGroups.slice(2, -1);

        expect(doubleBonuses).toHaveLength(5);
        doubleBonuses.forEach((group) => {
          expect(group).toHaveLength(2);
          group.forEach((position) => {
            expect(position.turnBonus).toEqual("double");
          });
        });

        const containsPair = (pair: [PlayerModel.Id, PlayerModel.Id]) =>
          doubleBonuses.some(
            (bonus) =>
              (bonus[0].id === pair[0] && bonus[1].id === pair[1]) ||
              (bonus[0].id === pair[1] && bonus[1].id === pair[0])
          );

        const pairs: [PlayerModel.Id, PlayerModel.Id][] = [
          ["1", "2"],
          ["1", "3"],
          ["3", "4"],
          ["4", "5"],
          ["5", "6"],
        ];

        // Each pair is contained
        pairs.forEach((pair) => {
          expect(containsPair(pair));
        });
      });
    });

    describe("triple bonuses", () => {
      beforeEach(() => {
        /**
         * Creates the following triple pairs:
         * (1,2,3)
         * (4,5,6)
         */
        gameOne.submitAction("1", buildAction(["2", "3"]));
        gameOne.submitAction("2", buildAction(["1", "3"]));
        gameOne.submitAction("3", buildAction(["1", "2"]));

        gameOne.submitAction("4", buildAction(["5", "6"]));
        gameOne.submitAction("5", buildAction(["4", "6"]));
        gameOne.submitAction("6", buildAction(["4", "5"]));

        jest.runOnlyPendingTimers();

        expect(isWellFormed(gameOne));
      });

      it("has single bonuses", () => hasSingleBonuses(gameOne, 6));

      it("has appropriate triple bonuses", () => {
        const tripleBonuses = gameOne.state.bonusGroups.slice(2, -1);

        expect(tripleBonuses).toHaveLength(2);
        tripleBonuses.forEach((group) => {
          expect(group).toHaveLength(3);
          group.forEach((position) => {
            expect(position.turnBonus).toEqual("triple");
          });
        });

        const containsTriplet = (
          pair: [PlayerModel.Id, PlayerModel.Id, PlayerModel.Id]
        ) =>
          tripleBonuses.some((bonus) => {
            const bonusIds = bonus.map((pos) => pos.id);
            return (
              bonusIds.includes(pair[0]) &&
              bonusIds.includes(pair[1]) &&
              bonusIds.includes(pair[2])
            );
          });

        const triplets: [PlayerModel.Id, PlayerModel.Id, PlayerModel.Id][] = [
          ["1", "2", "3"],
          ["4", "5", "6"],
        ];

        // Each pair is contained
        triplets.forEach((triplet) => {
          expect(containsTriplet(triplet));
        });
      });
    });

    describe("mix of bonuses", () => {
      beforeEach(() => {
        gameOne.submitAction("1", buildAction(["2"]));
        gameOne.submitAction("2", buildAction(["1"]));
        gameOne.submitAction("3", buildAction(["4", "5"]));

        gameOne.submitAction("4", buildAction(["5", "6"]));
        gameOne.submitAction("5", buildAction(["4", "6"]));
        gameOne.submitAction("6", buildAction(["4", "5"]));

        jest.runOnlyPendingTimers();

        expect(isWellFormed(gameOne));
      });

      it("has single bonuses", () => hasSingleBonuses(gameOne, 5));

      it("has one double bonus", () => {
        const doubleBonus = gameOne.state.bonusGroups[2];
        doubleBonus.forEach((pos) => {
          expect(pos.turnBonus).toEqual("double");
        });
        expect(doubleBonus).toHaveLength(2);
      });

      it("has one triple bonus", () => {
        const tripleBonus = gameOne.state.bonusGroups[3];
        tripleBonus.forEach((pos) => {
          expect(pos.turnBonus).toEqual("triple");
        });
        expect(tripleBonus).toHaveLength(3);
      });
    });
  });

  describe("game rounds", () => {
    describe("triple/none", () => {
      beforeEach(() => {
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
        expect(maxBonus("1")).toEqual("triple");
        expect(maxBonus("2")).toEqual("triple");
        expect(maxBonus("3")).toEqual("triple");

        expect(maxBonus("4")).toEqual("none");
        expect(maxBonus("5")).toEqual("none");
        expect(maxBonus("6")).toEqual("none");
      });
    });

    describe("triple/duo/single", () => {
      beforeEach(() => {
        gameOne.submitAction("1", buildAction(["2", "3"]));
        gameOne.submitAction("2", buildAction(["1", "3"]));
        gameOne.submitAction("3", buildAction(["1", "2"]));

        gameOne.submitAction("4", buildAction(["5", "6"]));
        gameOne.submitAction("5", buildAction(["4"]));
        gameOne.submitAction("6", buildAction([]));

        jest.runOnlyPendingTimers();
      });

      it("assigns bonuses", () => {
        expect(maxBonus("1")).toEqual("triple");
        expect(maxBonus("2")).toEqual("triple");
        expect(maxBonus("3")).toEqual("triple");

        expect(maxBonus("4")).toEqual("double");
        expect(maxBonus("5")).toEqual("double");
        expect(maxBonus("6")).toEqual("single");
      });

      it("puts single player at the bottom", () => {
        expect(
          playerPositions(gameOne).sort((a, b) => a.position - b.position)[0].id
        ).toEqual("6");
      });
    });
  });
});
