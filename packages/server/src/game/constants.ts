/**
 * All provided times are in milliseconds
 */
export type GameConstants = {
  lobbyTime: number;
  // round times are allowed to vary round to round
  gameOneRoundTime: (round: number) => number;
};

export const DefaultGameConstants: GameConstants = {
  lobbyTime: 120 * 1000,
  gameOneRoundTime: (round: number) => {
    if (round === 0) return 30 * 1000;
    if (round === 1) return 20 * 1000;
    else return 15 * 1000;
  },
};
