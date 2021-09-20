export namespace GameModel {
  /**
   * Combination of game actions; this is only used to represent
   * game-dependent action data. Game-independent action data
   * is included in { Action }, which is what the client should use.
   */
  export type GameAction =
    | LobbyModel.PlayerData
    | GameOneModel.Turn
    | GameTwoModel.Turn;

  /**
   * Combination of game states; this is only used to represent
   * game-dependent state. Game-independent state is included in
   * { State }, which is what the client should use.
   */
  export type GameState =
    | LobbyModel.State
    | GameOneModel.State
    | GameTwoModel.State;

  export type Action = GameAction;

  /**
   * Encodes the entire game state; the client should render
   * deterministically off this data without side effects.
   *
   * The client should use the data here as a source of truth;
   * the server has agency to modify round times, number of rounds,
   * and all other variables at any point.
   */
  export type State = GameState & {
    timestamp: Date | string;
    players: GameModel.Player[];
  };

  /**
   * Data used to identify all players in game
   */
  export type Player = {
    id: string;
    avatar: number;
  };
}

export namespace LobbyModel {
  export type PlayerData = {
    type: "lobby--player-data";
    avatar: number;
  };

  export type State = {
    type: "lobby";
    lobbyEndTime: Date | string;
  };
}

export namespace GameOneModel {
  /**
   * Data submitted by client to register player turn
   */
  export type Turn = {
    type: "game-one--turn";
    round: number;
    playersSelected: GameModel.Player[];
  };

  export type State = {
    type: "game-one";
    round: number;
    roundStartTime: Date | string;
    roundEndTime: Date | string;
    playerPositions: PlayerPosition[];
  };

  export type PlayerPosition = {
    player: GameModel.Player;
    position: number;
    previousTurnBonus?: TurnBonus;
  };

  /**
   * - none = no other player picked this player
   * - single = other players picked this player,
   *   but the player is not in a pair or triplet that picked each other
   * - double = the player is in at least one pair that picked each other
   * - triple = the player is in a triplet that all picked each other
   */
  export type TurnBonus = "none" | "single" | "double" | "triple";
}

export namespace GameTwoModel {
  /**
   * Data submitted by client to register player turn
   */
  export type Turn = {
    type: "game-two--turn";
    round: number;
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
    round: number;
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
