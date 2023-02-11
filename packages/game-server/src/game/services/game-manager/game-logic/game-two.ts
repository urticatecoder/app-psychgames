import { GameTwoModel, PlayerModel } from "@dpg/types";
import { getRandomItem } from "@dpg/utils";
import { FinalResults } from "./final-results.js";
import { AGame, GameInstance, GameException } from "./game.js";

type Selections = Map<
  PlayerModel.Id,
  GameTwoModel.TokenDistribution & { decisionTime: number }
>;
type PlayerResults = Map<PlayerModel.Id, GameTwoModel.PlayerResults>;

export class GameTwo implements GameInstance {
  public state: GameTwoModel.State;
  public playerResults?: PlayerResults;
  public finalPlayerResults?: PlayerResults;
  public receiptRoundNumber: number;
  private selections: Selections;
  private roundTimeout: NodeJS.Timeout | undefined;

  constructor(
    private game: AGame,
    losers: PlayerModel.Id[],
    winners: PlayerModel.Id[]
  ) {
    this.selections = new Map();
    this.receiptRoundNumber =
      Math.floor(Math.random() * (this.game.constants.gameTwo.maxRounds - 1)) +
      1;
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

  public getSelections(): Selections {
    return this.selections;
  }

  submitAction(playerId: string, action: GameTwoModel.Turn): void {
    // XXX: Re-enable this when frontend is fixed
    //this.validateAction(playerId, action);
    let actionWithTime = {
      keep: action.tokenDistribution.keep,
      invest: action.tokenDistribution.invest,
      compete: action.tokenDistribution.compete,
      decisionTime: action.decisionTime,
    };
    this.selections.set(playerId, actionWithTime);
  }

  private validateAction(playerId: string, action: GameTwoModel.Turn) {
    // The action should be of the correct type
    // TODO: Factor out this common validation
    if (action.type != "game-two_turn") {
      throw new GameException(
        `The action type ${action.type} does not match the expected type game-two_turn`,
        playerId
      );
    }

    // The action must be for the current round
    // TODO: Factor out this common validation
    if (action.round !== this.state.round) {
      throw new GameException(
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
      throw new GameException(
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

  // TODO: Factor out this common pattern
  public beginRound() {
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
    // TODO: Factor out this common functionality
    this.handleInactivePlayers();
    if (this.roundTimeout) {
      clearTimeout(this.roundTimeout);
    }
    const teamResults = calculateTeamResults(this.state, this.selections);
    const playerResults = this.calculatePlayerResults(teamResults);

    // This is called before state is updated here because when state is updated the invest and compete
    // coefficients are reset to new random values. Since they need to be stored, I push to the database
    // before the state update, and I also have to pass teamResults since it hasn't been added to state
    // yet.
    /*this.game.pushToDatabase(
      this.selections,
      teamResults,
      this.receiptRoundNumber
    );*/

    if (this.state.round == this.receiptRoundNumber) {
      this.finalPlayerResults = playerResults;
    }

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
      this.selections.clear();
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

      const otherTeamResult = isWinner
        ? teamResults.loserTeam
        : teamResults.winnerTeam;

      const playerTokens =
        selection.keep +
        teamResult.investBonus +
        otherTeamResult.competePenalty -
        teamResult.competePenalty;
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
   * TODO: Factor out this common functionality
   */
  private handleInactivePlayers() {
    let inactivePlayers: PlayerModel.Id[] = [];

    this.game.players.forEach((player) => {
      if (!this.selections.has(player)) {
        this.performBotMove(player);
        inactivePlayers.push(player);
      }
    });

    this.game.handleBots(inactivePlayers);
  }

  private performBotMove(player: PlayerModel.Id) {
    // Generate random token distribution that uses all 10 coins
    const competeTokens = Math.floor(Math.random()*11);
    const remainingTokens = 10 - competeTokens;
    const investTokens = Math.floor(Math.random()*(remainingTokens+1));
    const keepTokens = remainingTokens - investTokens;

    this.submitAction(player, {
      type: "game-two_turn",
      round: this.state.round,
      tokenDistribution: {
        compete: competeTokens,
        invest: investTokens,
        keep: keepTokens,
      },
      decisionTime: -1,
    });
  }

  private isGameOver(): boolean {
    return this.state.round === this.constants.maxRounds;
  }

  private endGame() {
    this.game.goToGame(
      new FinalResults(
        this.game,
        this.finalPlayerResults!,
        this.state.winners,
        this.state.losers
      )
    );
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
