import { GameModel, GameOneModel, PlayerModel } from "@dpg/types";
import { GameOneConstants } from "../constants";
import { AGame, GameError, GameInstance } from "./game";
import { GameTwo } from "./game-two";
import { getRandomItem } from "@dpg/utils";

// These constants are here for readability, but modifying them
// WILL BREAK THE GAME. The underlying math relies on these constants
// to function properly.
const WIN_POSITION = 1;
const LOSE_POSITION = -1;
const START_POSITION = 0;
const MAX_SELECTIONS = 2;

type Selections = Map<PlayerModel.Id, Set<PlayerModel.Id>>;
type BonusGroup = GameOneModel.PlayerPosition[];

/**
 * Implements the "game one" scenario as follows:
 * - All players begin at position 0.
 * - Players select some number of players (other than themselves) to move upwards.
 * - If a doublet/triplet of players picking each other are formed, the doublet/triplet
 *  gets bonus movement on top of the normal movement.
 * - At the end of each round, the player positions are normalized by subtracting the average
 *  movement from each player position. This implies that the average player position is always 0.
 * - When the players have been separated into the winning and losing positions, the game ends.
 *
 * NOTE: The movements are not fair or predictable; the objective of this game is to separate players
 * into winners and losers. To do this while preventing stalemate, the game will progressively add noise
 * and bias into the movements.
 */
export class GameOne implements GameInstance {
  private selections: Selections;
  private roundTimeout: NodeJS.Timeout | undefined;
  public state: GameOneModel.State;

  constructor(private game: AGame) {
    this.selections = new Map();
    this.state = this.createInitialState();
    this.beginRound();
  }

  getState(player: PlayerModel.Id): GameModel.GameState {
    return this.state;
  }

  submitAction(playerId: string, action: GameOneModel.Turn): void {
    this.validateAction(playerId, action);
    this.selections.set(playerId, new Set(action.playersSelected));
  }

  private get currentPositions() {
    return this.state.bonusGroups[this.state.bonusGroups.length - 1];
  }

  private get constants() {
    return this.game.constants.gameOne;
  }

  /**
   * Throws an appropriate error if an action is invalid, otherwise does nothing.
   */
  private validateAction(playerId: string, action: GameOneModel.Turn): void {
    // The action should be of the correct type
    if (action.type != "game-one_turn") {
      throw new GameError(
        `The action type ${action.type} does not match the expected type game-one_turn`,
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

    // The action must contain a maximum number of selections
    if (action.playersSelected.length > MAX_SELECTIONS) {
      throw new GameError(
        `Expected a maximum of ${MAX_SELECTIONS} selected players, recieved ${action.playersSelected.length}`,
        playerId
      );
    }

    // A player may not select themselves
    if (action.playersSelected.includes(playerId)) {
      throw new GameError(`Players cannot select themselves`, playerId);
    }
  }

  private createInitialState(): GameOneModel.State {
    // initialize player positions
    const playerPositions: GameOneModel.PlayerPosition[] = [];
    this.game.players.forEach((player) => {
      playerPositions.push({
        id: player,
        position: START_POSITION,
      });
    });

    // the first element of bonusGroups is the current position
    const bonusGroups = [];
    bonusGroups.push(playerPositions);

    const state: GameOneModel.State = {
      type: "game-one_state",
      round: 0,
      // will be set on round start
      roundStartTime: new Date(),
      roundEndTime: new Date(),
      bonusGroups,
    };

    return state;
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
    if (this.roundTimeout) {
      clearTimeout(this.roundTimeout);
    }
    const bonusGroups = makeBonusGroups(
      this.selections,
      this.currentPositions,
      this.constants,
      this.state.round
    );

    this.state = {
      ...this.state,
      round: this.state.round + 1,
      bonusGroups,
    };

    if (this.isGameOver()) {
      this.endGame();
    } else {
      this.beginRound();
    }
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
    // We can't select ourselves
    const players = this.game.players.filter((oPlayer) => oPlayer !== player);
    const p1 = getRandomItem(players);
    const p2 = getRandomItem(players);

    this.submitAction(player, {
      type: "game-one_turn",
      round: this.state.round,
      playersSelected: [p1, p2],
    });
  }

  private isGameOver(): boolean {
    return (
      // Have we reached the round limit?
      this.state.round === this.constants.maxRounds ||
      // Is every player in an ending position?
      this.currentPositions.every(
        (player) =>
          player.position === WIN_POSITION || player.position === LOSE_POSITION
      )
    );
  }

  private endGame() {
    const sortedPositions = this.currentPositions.sort(
      (a, b) => a.position - b.position
    );

    const losers = sortedPositions
      .slice(0, sortedPositions.length / 2)
      .map((pos) => pos.id);
    const winners = sortedPositions
      .slice(sortedPositions.length / 2)
      .map((pos) => pos.id);

    this.game.goToGame(new GameTwo(this.game, losers, winners));
  }
}

/**
 * Takes a map of player selections and the current player positions, and returns
 * a list of bonus groups as specified in @type {GameOneModel.State}.
 *
 * TODO: Clean up this mess
 *
 * This function does a mess of specific calculations to determine the bonus groups.
 * It could be generalized, but right now the rest of GameOne is fairly trivial as long
 * as this function contains all the complexity. Also, finding a general solution to this
 * problem is a bit of a pain.
 */
function makeBonusGroups(
  selections: Selections,
  previousPositions: GameOneModel.PlayerPosition[],
  constants: GameOneConstants,
  round: number
): BonusGroup[] {
  const currentPositions = new Map<PlayerModel.Id, number>();
  previousPositions.forEach((player) => {
    currentPositions.set(player.id, player.position);
  });

  const singleSelectionMap = countSingleSelections(selections);
  const tripleGroups = makeTripleGroups(selections);

  // To prevent double/triple mixups, we need to remove players in a triple group from the selections
  const modifiedSelections = new Map(selections);
  tripleGroups.forEach((tripleGroup) => {
    tripleGroup.forEach((player) => {
      modifiedSelections.delete(player);
    });
  });

  const doubleGroups = makeDoubleGroups(modifiedSelections);

  /**
   * Calculate new position groups
   *
   * The single bonuses are done all at once to save animation time, then the
   * double and triple bonuses are done separately.
   *
   * Our displayed positions are always between -1 and 1, but our actual positions are
   * only limited at the end to avoid people at the limits from being pushed down arbitrarily.
   */
  const calculateNewPositionsForSelectionGroups = (
    selectionGroups: PlayerModel.Id[][],
    bonusFn: (round: number, position: number) => number,
    turnBonus: GameOneModel.TurnBonus
  ) =>
    selectionGroups.map((group) =>
      group.map((id) => {
        const currentPosition = getCurrentPosition(id, currentPositions);
        const newPosition = currentPosition + bonusFn(round, currentPosition);
        const displayedPosition = limitPosition(newPosition);
        currentPositions.set(id, newPosition);

        const posObj: GameOneModel.PlayerPosition = {
          id,
          position: displayedPosition,
          turnBonus: turnBonus,
        };

        return posObj;
      })
    );

  const singleBonusGroup: BonusGroup = [];
  singleSelectionMap.forEach((timesSelected, id) => {
    const currentPosition = getCurrentPosition(id, currentPositions);
    const newPosition =
      currentPosition +
      constants.positionChange.single(round, currentPosition) * timesSelected;
    const displayedPosition = limitPosition(newPosition);

    singleBonusGroup.push({
      id,
      position: displayedPosition,
      turnBonus: "single",
    });
    currentPositions.set(id, newPosition);
  });

  const doubleBonusGroups: BonusGroup[] =
    calculateNewPositionsForSelectionGroups(
      doubleGroups,
      constants.positionChange.double,
      "double"
    );

  const tripleBonusGroups: BonusGroup[] =
    calculateNewPositionsForSelectionGroups(
      tripleGroups,
      constants.positionChange.triple,
      "triple"
    );

  // Calculate the average player movement
  const averageMovement =
    previousPositions.reduce(
      (totalMovement, player) =>
        totalMovement +
        (getCurrentPosition(player.id, currentPositions) - player.position),
      0
    ) / previousPositions.length;

  // Normalize by subtracting the average movement from each player
  // We also limit the actual positions here to be between -1, 1
  const normalizedBonusGroup: BonusGroup = [];
  currentPositions.forEach((position, id) => {
    const newPosition = limitPosition(position - averageMovement);

    normalizedBonusGroup.push({
      id,
      position: newPosition,
      turnBonus: "none",
    });
    currentPositions.set(id, newPosition);
  });

  let bonusGroups: BonusGroup[] = [];

  // The first element is always the previous positions
  bonusGroups.push(previousPositions);

  // The second element is all the single bonuses
  // We don't include it if it is empty
  if (singleBonusGroup.length !== 0) {
    bonusGroups.push(singleBonusGroup);
  }

  // Now we add all the double bonuses
  bonusGroups = bonusGroups.concat(doubleBonusGroups);

  // And then the triple bonuses
  bonusGroups = bonusGroups.concat(tripleBonusGroups);

  // The final element is the normalized bonus group
  bonusGroups.push(normalizedBonusGroup);

  return bonusGroups;
}

function getCurrentPosition(
  id: PlayerModel.Id,
  currentPositions: Map<PlayerModel.Id, number>
) {
  const position = currentPositions.get(id);
  if (position === undefined) {
    throw new Error(`Player ${id} not found in current positions`);
  }
  return position;
}

function limit(num: number, lim1: number, lim2: number) {
  const max = Math.max(lim1, lim2);
  const min = Math.min(lim1, lim2);

  return Math.max(Math.min(num, max), min);
}

function limitPosition(position: number) {
  return limit(position, LOSE_POSITION, WIN_POSITION);
}

// The following functions are overcomplicated and specific.
// Could I write an algorithm that detects hyper connected groups
// of a specific size? Yes. Am I going to do that? No.
// You can blame me when this is used for some experiment
// that wants to do larger games and you have to rewrite this.
// I really don't want to make a whole graph implementation right now.

function makeDoubleGroups(selections: Selections) {
  const doubleGroups: PlayerModel.Id[][] = [];

  selections.forEach((playersSelected, playerID) => {
    // Check each player selection to see if it was reciprocated
    playersSelected.forEach((otherPlayerID) => {
      if (selections.get(otherPlayerID)?.has(playerID)) {
        // If it was, we have a doublet with this player and the other player
        const doublet = [playerID, otherPlayerID];

        // Now check if this doublet is already in the doublet groups
        const doubletAlreadyEntered = doubleGroups.some((group) =>
          group.every((id) => doublet.includes(id))
        );

        if (!doubletAlreadyEntered) {
          doubleGroups.push(doublet);
        }
      }
    });
  });

  return doubleGroups;
}

function makeTripleGroups(selections: Selections) {
  const tripleGroups: PlayerModel.Id[][] = [];

  selections.forEach((playersSelected, playerID) => {
    // Check for a strongly connected triple
    const otherPlayers = Array.from(playersSelected.values());
    const op1 = otherPlayers[0];
    const op2 = otherPlayers[1];

    const isTriple =
      selections.get(op1)?.has(playerID) &&
      selections.get(op1)?.has(op2) &&
      selections.get(op2)?.has(playerID) &&
      selections.get(op2)?.has(op1);

    if (isTriple) {
      const triplet = [playerID, op1, op2];

      const tripletAlreadyEntered = tripleGroups.some((group) =>
        group.every((id) => triplet.includes(id))
      );

      if (!tripletAlreadyEntered) {
        tripleGroups.push(triplet);
      }
    }
  });

  return tripleGroups;
}

function countSingleSelections(selections: Selections) {
  const singleSelectionMap = new Map<PlayerModel.Id, number>();

  selections.forEach((playersSelected) => {
    playersSelected.forEach((playerSelected) => {
      // increment the count of the player selected
      singleSelectionMap.set(
        playerSelected,
        singleSelectionMap.get(playerSelected) ?? 0 + 1
      );
    });
  });

  return singleSelectionMap;
}
