import type {
  GameOneTurnRequest,
  GameTwoTurnRequest,
  LobbyAvatarRequest,
} from "./game-requests.js";
import type { PlayerModel } from "./player.model.js";

type IdObj = { id: PlayerModel.Id };
export namespace GameModel {
  /**
   * Combination of game actions; this is only used to represent
   * game-dependent action data. Game-independent action data
   * is included in { Action }, which is what the client should use.
   */
  export type GameAction =
    | LobbyAvatarRequest
    | GameOneTurnRequest
    | GameTwoTurnRequest;

  export type Action = GameAction;

  /**
   * Combination of game states; this is only used to represent
   * game-dependent state. Game-independent state is included in
   * { State }, which is what the client should use.
   */
  export type GameState =
    | LobbyModel.State
    | GameOneModel.State
    | GameTwoModel.State
    | GameOneTutorialModel.State
    | GameTwoTutorialModel.State
    | FinalResultsModel.State;

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
    playerData: Player[];
  };

  export type Player = PlayerModel.Data & IdObj;
}

export namespace LobbyModel {
  export type AvatarRequest = LobbyAvatarRequest;

  export type State = {
    type: "lobby";
    lobbyEndTime: Date | string;
  };
}

export namespace GameOneTutorialModel {
  export type State = {
    type: "game-one-tutorial";
    tutorialEndTime: Date | string;
  }
}

export namespace GameTwoTutorialModel {
  export type State = {
    type: "game-two-tutorial";
    tutorialEndTime: Date | string;
    winners: PlayerModel.Id[];
    losers: PlayerModel.Id[];
  }
}

export namespace FinalResultsModel {
  export type State = {
    type: "final-results";
    playerResults?: GameTwoModel.PlayerResults;
  }
}

export namespace GameOneModel {
  export type Turn = GameOneTurnRequest;

  export type State = {
    type: "game-one_state";
    round: number;
    roundStartTime: Date | string;
    roundEndTime: Date | string;

    /**
     * Lists incremental position changes for each bonus group.
     *
     * The entries are structured as follows:
     * 0: The initial player positions.
     *    Always contains all players with a turn bonus of "none"
     *
     * 1 to (n-1): Player movement groups for animation.
     *    Usually does *not* contain all the players; the client is
     *    responsible for not animating unlisted players in each group.
     *    The turn bonus to display for each player is also provided.
     *
     *    Note that a player can be in multiple of these groups, with
     *    various turn bonuses. There is also no guarantee around how
     *    players will move relative to their bonuses or even within
     *    a single group. You can generally expect players within an
     *    animation group to move similar amounts, but they *must* be
     *    moved individually. The server algorithm has the right to
     *    (and will especially as the game goes on) to introduce noise
     *    and bias into player positions.
     *
     * n: The final player positions *after renormalization*
     *    Always contains all players with a turn bonus of "none"
     *
     * If there is only one entry in the array, then it is also round 0
     * and there is no animation step to perform.
     */
    bonusGroups: PlayerPosition[][];
  };

  export type PlayerPosition = IdObj & {
    position: number;
    turnBonus?: TurnBonus;
  };

  /**
   * - none = no other player picked this player
   * - single = other players picked this player,
   *   but the player is not in a pair or triplet that picked each other
   * - double = the player is in a pair that picked each other
   * - triple = the player is in a triplet that all picked each other
   */
  export type TurnBonus = "none" | "single" | "double" | "triple";
}

export namespace GameTwoModel {
  export type Turn = GameTwoTurnRequest;

  export type State = {
    type: "game-two_state";
    winners: PlayerModel.Id[];
    losers: PlayerModel.Id[];
    round: number;
    roundStartTime: Date | string;
    roundEndTime: Date | string;
    investCoefficient: number;
    competeCoefficient: number;
    teamResults?: TeamResults;
  };

  export type PlayerState = State & {
    playerResults?: PlayerResults;
  };

  export type TeamResults = {
    winnerTeam: TeamEarnings;
    loserTeam: TeamEarnings;
  };

  export type PlayerResults = {
    netTokens: number;
    netMoney: number;
  };

  export type TeamEarnings = {
    totalTokenDistribution: TokenDistribution;
    investBonus: number;
    competePenalty: number;
  };

  export type TokenDistribution = {
    compete: number;
    invest: number;
    keep: number;
  };
}
