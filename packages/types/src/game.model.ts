export namespace GameData {
  export type Action = Lobby.PlayerData | GameOne.Turn | GameTwo.Turn;

  /**
   * Encodes the entire game state; the client should render
   * deterministically off this data without side effects.
   */
  export type State = (Lobby.State | GameOne.State | GameTwo.State) & {
    timestamp: Date | string;
  };

  /**
   * Data used to identify all players in game
   */
  export type Player = {
    id: string;

    /**
     * TODO: implement interface for avatar data
     */
    avatar: string;
  };
}

export namespace Lobby {
  export type PlayerData = {
    type: "lobby--player-data";
    avatar: string;
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
    playerPositions: {
      player: GameData.Player;
      position: number;
      previousTurnBonus?: TurnBonus;
    }[];
  };

  export type TurnBonus = "none" | "doublet" | "triplet";
}

export namespace GameTwo {
  /**
   * Data submitted by client to register player turn
   */
  export type Turn = {
    type: "game-two--turn";
    tokenDistribution: {
      compete: number;
      invest: number;
      keep: number;
    };
  };

  export type State = {
    type: "game-two";
    team: "winners" | "losers";
    turnNumber: number;
    roundStartTime: Date | string;
    roundEndTime: Date | string;
    investCoefficient: number;
    competeCoefficient: number;
    previousRoundResults?: {
      winnerTeam: TeamEarnings;
      loserTeam: TeamEarnings;
    };
  };

  export type TeamEarnings = {
    totalTokenDistribution: {
      competeTotal: number;
      investTotal: number;
      keepTotal: number;
    };
    investBonus: number;
    competePenalty: number;
    netTokens: number;
    netMoney: number;
  };
}
