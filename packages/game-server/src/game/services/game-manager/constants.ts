/**
 * All provided times are in milliseconds
 */
export type GameConstants = {
  lobbyTime: number;
  gameOne: GameOneConstants;
  gameTwo: GameTwoConstants;
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
  gameOne: {
    roundTime: (round: number) => {
      if (round === 0) return 30 * s;
      if (round === 1) return 20 * s;
      else return 15 * s;
    },
    maxRounds: 10,
    // TODO: change these to something sensible
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
    maxRounds: 15,
    possibleInvestCoefficients: [0, 0.5, 1, 1.5, 2],
    possibleCompeteCoefficients: [0, 0.5, 1, 1.5, 2],
    tokensPerRound: 10,
    tokenDollarValue: 0.25,
  },
};
