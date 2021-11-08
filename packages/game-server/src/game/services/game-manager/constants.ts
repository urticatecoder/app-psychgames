/**
 * All provided times are in milliseconds
 */
export type GameConstants = {
  lobbyTime: number;
  // round times are allowed to vary round to round
  gameOne: GameOneConstants;
};

export type GameOneConstants = {
  roundTime: (round: number) => number;
  maxRounds: number;
  positionChange: {
    single: (round: number, position: number) => number;
    double: (round: number, position: number) => number;
    triple: (round: number, position: number) => number;
  };
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
};
