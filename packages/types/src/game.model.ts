export namespace GameData {
  export type Action = Lobby.PlayerData | GameOne.Turn | GameTwo.Turn;

  /**
   * Encodes the entire game state; the client should render
   * deterministically off this data without side effects.
   *
   * The client should use the data here as a source of truth;
   * the server has agency to modify round times, number of rounds,
   * and all other variables at any point.
   */
  export type State = (Lobby.State | GameOne.State | GameTwo.State) & {
    timestamp: Date | string;
  };

  /**
   * Data used to identify all players in game
   */
  export type Player = {
    id: string;
    avatar: number;
  };
}

export namespace Lobby {
  export type PlayerData = {
    type: "lobby--player-data";
    avatar: number;
  };

  export type State = {
    type: "lobby";
    lobbyEndTime: Date | string;
  };
}

export namespace GameOne {
  /**
   * Data submitted by client to register player turn
   */
  export type Turn = {
    type: "game-one--turn";
    playersSelected: GameData.Player[];
  };

  export type State = {
    type: "game-one";
    turnNumber: number;
    roundStartTime: Date | string;
    roundEndTime: Date | string;
    playerPositions: PlayerPosition[];
  };

  export type PlayerPosition = {
    player: GameData.Player;
    position: number;
    previousTurnBonus?: TurnBonus;
  };

  export type TurnBonus = "none" | "doublet" | "triplet";
}

export namespace GameTwo {
  /**
   * Data submitted by client to register player turn
   */
  export type Turn = {
    type: "game-two--turn";
    tokenDistribution: TokenDistribution;
  };

  export type TokenDistribution = {
    compete: number;
    invest: number;
    keep: number;
  };

  export type State = {
    type: "game-two";
    team: "winners" | "losers";
    turnNumber: number;
    roundStartTime: Date | string;
    roundEndTime: Date | string;
    investCoefficient: number;
    competeCoefficient: number;
    previousRoundResults?: PreviousRoundResults;
  };

  export type PreviousRoundResults = {
    winnerTeam: TeamEarnings;
    loserTeam: TeamEarnings;
  };

  export type TeamEarnings = {
    totalTokenDistribution: TokenDistribution;
    investBonus: number;
    competePenalty: number;
    netTokens: number;
    netMoney: number;
  };
}
