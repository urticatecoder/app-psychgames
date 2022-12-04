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
    /*
     * TODO: This can run into a pathological situation where 1 or 2 players
     * have much higher/lower scores than the rest, so players are not split
     * evenly above/below the origin. This should probably use distance from
     * the average position, rather than absolute position, to introduce a
     * bias.
     */
    single: (round: number, position: number) => number;
    double: (round: number, position: number) => number;
    triple: (round: number, position: number) => number;
  };
};

export type GameTwoConstants = {
  roundTime: (round: number) => number;
  maxRounds: number;

  possibleInvestCoefficients: number[];
  possibleCompeteCoefficients: number[];

  tokensPerRound: number;
  tokenDollarValue: number;
};

const bias = (position: number) => position * 0.3;
const s = 1000;

export const DefaultGameConstants: GameConstants = {
  lobbyTime: 120 * s,
  gameOneTutorialTime: 120 * s,
  gameTwoTutorialTime: 195 * s,
  gameOne: {
    // TODO: change these to something sensible
    roundTime: (round: number) => {
      if (round === 0) return 30 * s;
      if (round === 1) return 20 * s;
      else return 15 * s;
    },
    maxRounds: 35,
    positionChange: {
      // we arbitrarily bias position by 30% of their distance from the origin
      single: (round, position) => 0.05 * round * round + 0.1 + bias(position),
      double: (round, position) => 0.05 * round * round + 0.1 + bias(position),
      triple: (round, position) => 0.15 * round * round + 0.35 + bias(position),
    },
  },
  gameTwo: {
    roundTime: (round: number) => {
      if (round === 0) return 30 * s;
      if (round === 1) return 20 * s;
      else return 15 * s;
    },
    maxRounds: 30,
    possibleInvestCoefficients: [0, 0.5, 1, 1.5, 2],
    possibleCompeteCoefficients: [0, 0.5, 1, 1.5, 2],
    tokensPerRound: 10,
    tokenDollarValue: 0.25,
  },

  finalResultsProlificCode: "abcdefg",
};
