/**
 * All provided times are in milliseconds
 */
export type GameConstants = {
  lobbyTime: number;
  gameOneTutorialTime: number;
  gameTwoTutorialTime: number;
  gameOne: GameOneConstants;
  gameTwo: GameTwoConstants;
  finalResultsProlificCode: string;
};

export type GameOneConstants = {
  // round times are allowed to vary round to round
  roundTime: (round: number) => number;
  maxRounds: number;
  positionChange: {
    single: (round: number, position: number) => number;
    double: (round: number, position: number) => number;
    triple: (round: number, position: number) => number;
  };
  /*
   * Bias is used to push the top half of players upwards, and the bottom half of players downwards.
   * The end position formula is:
   * - Winning: position + totalPositionChange * (1 + bias.multiplicative) + bias.absolute
   * - Losing: position + totalPositionChange * (1 - bias.multiplicative) - bias.absolute
   */
  bias: (
    round: number,
    position: number
  ) => { absolute: number; multiplicative: number };
};

export type GameTwoConstants = {
  roundTime: (round: number) => number;
  maxRounds: number;

  possibleInvestCoefficients: number[];
  possibleCompeteCoefficients: number[];

  tokensPerRound: number;
  tokenDollarValue: number;
};

const s = 1000;

export const DefaultGameConstants: GameConstants = {
  // lobbyTime: 120 * s,
  lobbyTime: 3 * s,
  // gameOneTutorialTime: 120 * s,
  gameOneTutorialTime: 3 * s,
  gameTwoTutorialTime: 195 * s,
  gameOne: {
    // TODO: change these to something sensible
    roundTime: (round: number) => {
      let animationTime = 10 * s;
      if (round === 0) return 30 * s + animationTime;
      if (round === 1) return 20 * s + animationTime;
      else return 15 * s + animationTime;
    },
    maxRounds: 35,
    positionChange: {
      single: (round, position) => 0.05,
      double: (round, position) => 0.05,
      triple: (round, position) => 0.1,
    },
    bias: (round, position) => ({
      absolute: 0.015 * round,
      multiplicative: 0.1,
    }),
  },
  gameTwo: {
    roundTime: (round: number) => {
      let animationTime = 10 * s;
      if (round === 0) return 30 * s + animationTime;
      if (round === 1) return 20 * s + animationTime;
      else return 15 * s + animationTime;
    },
    maxRounds: 10,
    possibleInvestCoefficients: [0, 0.5, 1, 1.5, 2],
    possibleCompeteCoefficients: [0, 0.5, 1, 1.5, 2],
    tokensPerRound: 10,
    tokenDollarValue: 0.25,
  },

  finalResultsProlificCode: "abcdefg",
};
