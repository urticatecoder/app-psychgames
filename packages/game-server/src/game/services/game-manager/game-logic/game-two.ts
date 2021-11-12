import { GameTwoModel, PlayerModel } from "@dpg/types";
import { getRandomItem } from "@dpg/utils";
import { AGame, GameError, GameInstance } from "./game.js";

type Selections = Map<PlayerModel.Id, GameTwoModel.TokenDistribution>;
type PlayerResults = Map<PlayerModel.Id, GameTwoModel.PlayerResults>;
export class GameTwo implements GameInstance {
  public state: GameTwoModel.State;
  public playerResults?: PlayerResults;
  private selections: Selections;
  private roundTimeout: NodeJS.Timeout | undefined;

  constructor(
    private game: AGame,
    losers: PlayerModel.Id[],
    winners: PlayerModel.Id[]
  ) {
    this.selections = new Map();
    this.state = this.createInitialState(losers, winners);
  }

  getState(player: PlayerModel.Id): GameTwoModel.PlayerState {
    if (!this.playerResults) {
      return this.state;
    }

    return {
      ...this.state,
      playerResults: this.playerResults.get(player),
    };
  }

  private get constants() {
    return this.game.constants.gameTwo;
  }

  submitAction(playerId: string, action: GameTwoModel.Turn): void {
    this.validateAction(playerId, action);
    this.selections.set(playerId, action.tokenDistribution);
  }

  private validateAction(playerId: string, action: GameTwoModel.Turn) {
    // The action should be of the correct type
    if (action.type != "game-two_turn") {
      throw new GameError(
        `The action type ${action.type} does not match the expected type game-two_turn`,
        playerId
      );
    }

    // The action must be for the current round
    if (action.round !== this.state.round) {
      throw new GameError(
        `Expected an action for round ${this.state.round}, recieved ${action.round}. 
        This may be because you submitted an action just as the round advanced, 
        in which case this error is safe.`,
        playerId
      );
    }

    // The submitted number of tokens must be <= the tokens given per round
    const numTokens =
      action.tokenDistribution.compete +
      action.tokenDistribution.invest +
      action.tokenDistribution.keep;
    if (numTokens > this.constants.tokensPerRound) {
      throw new GameError(
        `The number of submitted tokens ${numTokens} is greater than the maximum 
        number of tokens per round, ${this.constants.tokensPerRound}`,
        playerId
      );
    }
  }

  private createInitialState(
    losers: PlayerModel.Id[],
    winners: PlayerModel.Id[]
  ): GameTwoModel.State {
    return {
      type: "game-two_state",
      losers,
      winners,
      round: 0,
      roundStartTime: new Date(),
      roundEndTime: new Date(),
      investCoefficient: this.createInvestCoefficient(),
      competeCoefficient: this.createCompeteCoefficient(),
    };
  }

  private createInvestCoefficient() {
    return getRandomItem(this.constants.possibleInvestCoefficients);
  }

  private createCompeteCoefficient() {
    return getRandomItem(this.constants.possibleCompeteCoefficients);
  }

  private beginRound() {
    const roundStartTime = new Date();
    const roundEndTime = new Date(
      roundStartTime.getTime() + this.constants.roundTime(this.state.round)
    );

    this.state = {
      ...this.state,
      roundStartTime,
      roundEndTime,
    };
    this.game.emitState();

    // timeout to advance round
    this.roundTimeout = setTimeout(
      () => this.advanceRound(),
      roundEndTime.getTime() - Date.now()
    );
  }

  private advanceRound() {
    this.handleInactivePlayers();
    const teamResults = calculateTeamResults(this.state, this.selections);
    const playerResults = this.calculatePlayerResults(teamResults);

    this.state = {
      ...this.state,
      round: this.state.round + 1,
      teamResults,
      investCoefficient: this.createInvestCoefficient(),
      competeCoefficient: this.createCompeteCoefficient(),
    };
    this.playerResults = playerResults;

    if (this.isGameOver()) {
      this.endGame();
    } else {
      this.beginRound();
    }
  }

  private calculatePlayerResults(
    teamResults: GameTwoModel.TeamResults
  ): PlayerResults {
    const playerResults = new Map<PlayerModel.Id, GameTwoModel.PlayerResults>();

    this.selections.forEach((selection, player) => {
      const isWinner = this.state.winners.includes(player);
      const teamResult = isWinner
        ? teamResults.winnerTeam
        : teamResults.loserTeam;
      const playerTokens =
        selection.keep + teamResult.investBonus - teamResult.competePenalty;
      const playerResult = {
        netTokens: playerTokens,
        netMoney: playerTokens * this.constants.tokenDollarValue,
      };
      playerResults.set(player, playerResult);
    });

    return playerResults;
  }

  /**
   * For any players that did not submit an action, we will perform a bot move.
   *
   * TODO: Integrate this with GameManager passivity
   *
   * The GameManager should recieve all the inactive players and decide if they are
   * actual bots, or if they are players that need to be kicked.
   */
  private handleInactivePlayers() {
    this.game.players.forEach((player) => {
      if (!this.selections.has(player)) {
        this.performBotMove(player);
        // TODO: GameManager integration here
      }
    });
  }

  private performBotMove(player: PlayerModel.Id) {
    // Generate random values for each set of tokens
    const randomVals = [0, 0, 0].map(() => Math.random());

    // Normalize sum of values to 1
    const sumOfVals = randomVals.reduce((acc, val) => acc + val);
    const normalizedVals = randomVals.map((val) => val / sumOfVals);

    // Map normalized values to respective numbers of tokens
    const tokens = normalizedVals.map((val) =>
      Math.floor(val * this.constants.tokensPerRound)
    );

    // The above will produce a total token distribution <= the max tokens per round
    this.submitAction(player, {
      type: "game-two_turn",
      round: this.state.round,
      tokenDistribution: {
        compete: tokens[0],
        invest: tokens[1],
        keep: tokens[2],
      },
    });
  }

  private isGameOver(): boolean {
    return this.state.round === this.constants.maxRounds;
  }

  private endGame() {
    this.game.endGame();
  }
}

function calculateTeamResults(
  state: GameTwoModel.State,
  selections: Selections
): GameTwoModel.TeamResults {
  const winnerTokenDistributions: GameTwoModel.TokenDistribution[] = [];
  const loserTokenDistributions: GameTwoModel.TokenDistribution[] = [];

  selections.forEach((selection, player) => {
    if (state.winners.includes(player)) {
      winnerTokenDistributions.push(selection);
    } else {
      loserTokenDistributions.push(selection);
    }
  });

  const winnerTokenDistribution = calculateTeamTokenDistribution(
    winnerTokenDistributions
  );
  const loserTokenDistribution = calculateTeamTokenDistribution(
    loserTokenDistributions
  );

  return {
    winnerTeam: {
      totalTokenDistribution: winnerTokenDistribution,
      investBonus: winnerTokenDistribution.invest * state.investCoefficient,
      competePenalty: loserTokenDistribution.compete * state.competeCoefficient,
    },
    loserTeam: {
      totalTokenDistribution: loserTokenDistribution,
      investBonus: loserTokenDistribution.invest * state.investCoefficient,
      competePenalty:
        winnerTokenDistribution.compete * state.competeCoefficient,
    },
  };
}

function calculateTeamTokenDistribution(
  tokenDistributions: GameTwoModel.TokenDistribution[]
): GameTwoModel.TokenDistribution {
  const totalInvestTokens = tokenDistributions.reduce(
    (acc, tokenDistribution) => acc + tokenDistribution.invest,
    0
  );

  const totalCompeteTokens = tokenDistributions.reduce(
    (acc, tokenDistribution) => acc + tokenDistribution.compete,
    0
  );

  const totalKeepTokens = tokenDistributions.reduce(
    (acc, tokenDistribution) => acc + tokenDistribution.keep,
    0
  );

  return {
    invest: totalInvestTokens,
    compete: totalCompeteTokens,
    keep: totalKeepTokens,
  };
}
