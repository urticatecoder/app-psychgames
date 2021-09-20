/**
 * All provided times are in milliseconds
 */
export type GameConstants = {
  lobbyTime: number;
  // round times are allowed to vary round to round
  gameOne: {
    roundTime: (round: number) => number;
    maxRounds: number;
    positionChange: {
      bias: (position: number) => number;
      single: (round: number) => number;
      double: (round: number) => number;
      triple: (round: number) => number;
    };
  };
};

export const DefaultGameConstants: GameConstants = {
  lobbyTime: 120 * 1000,
  gameOne: {
    roundTime: (round: number) => {
      if (round === 0) return 30 * 1000;
      if (round === 1) return 20 * 1000;
      else return 15 * 1000;
    },
    maxRounds: 10,
    // TODO: change these to something sensible
    positionChange: {
      // we arbitrarily bias position by 30% of their distance from the origin
      bias: (position) => position * 0.3,
      single: (round) => 0.05 * round * round + 0.1,
      double: (round) => 0.05 * round * round + 0.2,
      triple: (round) => 0.05 * round * round + 0.35,
    },
  },
};
