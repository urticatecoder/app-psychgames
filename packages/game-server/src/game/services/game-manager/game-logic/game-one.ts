import { GameOneModel, GameModel, PlayerModel } from "@dpg/types";
import { AGame, GameError, GameInstance } from "./game.js";

const WIN_POSITION = 1;
const LOSE_POSITION = -1;

export class GameOne implements GameInstance {
  private selections: Map<PlayerModel.ID, Set<PlayerModel.ID>>;

  public state: GameOneModel.State;

  constructor(private game: AGame) {
    this.selections = new Map();
    const playerPositions: GameOneModel.PlayerPosition[] = [];
    game.players.forEach((player) => {
      playerPositions.push({
        player: player,
        position: 0,
      });
    });

    this.state = {
      type: "game-one",
      round: 0,
      // will be set on round start
      roundStartTime: new Date(),
      roundEndTime: new Date(),
      playerPositions,
    };

    this.beginRound();
  }

  submitAction(playerID: string, action: GameOneModel.Turn): void {
    if (action.round !== this.state.round) {
      throw new GameError(
        `Expected an action for round ${this.state.round}, recieved ${action.round}. 
        This may be because you submitted an action just as the round advanced, 
        in which case this error is safe.`,
        playerID
      );
    }

    if (action.playersSelected.length > 2) {
      throw new GameError(
        `Expected a maximum of 2 selected players, recieved ${action.playersSelected.length}`,
        playerID
      );
    }

    this.selections.set(
      playerID,
      new Set(action.playersSelected.map((player: PlayerModel.ID) => player))
    );
  }

  private beginRound() {
    const roundStartTime = new Date();
    const roundEndTime = new Date(
      roundStartTime.getTime() +
        this.game.constants.gameOne.roundTime(this.state.round)
    );

    this.state = {
      ...this.state,
      roundStartTime,
      roundEndTime,
    };
    this.game.emitState();

    // timeout to advance round
    setTimeout(() => this.advanceRound(), roundEndTime.getTime() - Date.now());
  }

  private advanceRound() {
    this.performBotMoves();
    const playerPositions = this.calculatePlayerPositions();
    this.state = {
      ...this.state,
      round: this.state.round + 1,
      playerPositions,
    };

    if (this.isRoundOver()) {
      this.game.goToNextGame();
    } else {
      this.beginRound();
    }
  }

  private calculatePlayerPositions(): GameOneModel.PlayerPosition[] {
    const rawPositions = this.state.playerPositions.map(
      (playerPosition: GameOneModel.PlayerPosition) =>
        this.calculatePlayerPosition(playerPosition)
    );

    // normalize positions
    const oldAveragePosition =
      this.state.playerPositions.reduce((sum, curr) => sum + curr.position, 0) /
      this.state.playerPositions.length;

    const newAveragePosition =
      rawPositions.reduce((sum, curr) => sum + curr.position, 0) /
      rawPositions.length;

    const averageMovement = newAveragePosition - oldAveragePosition;

    const finalPositions = rawPositions.map((playerPosition) => ({
      ...playerPosition,
      position: this.limit(
        playerPosition.position - averageMovement,
        WIN_POSITION,
        LOSE_POSITION
      ),
    }));

    return finalPositions;
  }

  private limit(num: number, lim1: number, lim2: number) {
    const max = Math.max(lim1, lim2);
    const min = Math.min(lim1, lim2);

    return Math.max(Math.min(num, max), min);
  }

  private calculatePlayerPosition(
    playerPosition: GameOneModel.PlayerPosition
  ): GameOneModel.PlayerPosition {
    // first, who selected this player?
    const playerID = playerPosition.player;
    const selectedBy: PlayerModel.ID[] = [];
    this.selections.forEach((selections, otherPlayerID) => {
      if (selections.has(playerID)) selectedBy.push(otherPlayerID);
    });

    // if no one selected this player they don't move
    if (selectedBy.length === 0) {
      return {
        ...playerPosition,
        previousTurnBonus: "none",
      };
    }

    const singles = selectedBy.length;
    const playerSelections = [...(this.selections.get(playerID) ?? [])];
    let turnBonus: GameOneModel.TurnBonus = "single";

    // count doubles
    let doubles = 0;
    playerSelections.forEach((selectedOtherPlayer) => {
      if (selectedBy.includes(selectedOtherPlayer)) {
        doubles++;
        turnBonus = "double";
      }
    });

    // count triples
    let triples = 0;
    // under the current rules we can only select two players
    if (
      // must have selected two players
      playerSelections.length === 2 &&
      // must have been selected by both of the players that they selected
      selectedBy.includes(playerSelections[0]) &&
      selectedBy.includes(playerSelections[1]) &&
      // and those two players must have selected each other
      this.selections.get(playerSelections[0])?.has(playerSelections[1]) &&
      this.selections.get(playerSelections[1])?.has(playerSelections[0])
    ) {
      triples = 1;
      turnBonus = "triple";
    }

    const positionChangeConstants = this.game.constants.gameOne.positionChange;
    const positionChange =
      singles *
        positionChangeConstants.single(
          this.state.round,
          playerPosition.position
        ) +
      doubles *
        positionChangeConstants.double(
          this.state.round,
          playerPosition.position
        ) +
      triples *
        positionChangeConstants.triple(
          this.state.round,
          playerPosition.position
        );

    return {
      ...playerPosition,
      position: playerPosition.position + positionChange,
      previousTurnBonus: turnBonus,
    };
  }

  private isRoundOver(): boolean {
    if (this.state.round === this.game.constants.gameOne.maxRounds) {
      return true;
    }

    const playersAtBoundaries = this.state.playerPositions.reduce(
      (areAtBoundary, playerPosition) =>
        areAtBoundary &&
        (playerPosition.position === WIN_POSITION ||
          playerPosition.position == LOSE_POSITION),
      true
    );

    return playersAtBoundaries;
  }

  private performBotMoves() {
    this.game.players.forEach((player) => {
      if (!this.selections.has(player)) {
        // if we did not recieve an action for a player,
        // perform a random move for them
        let players = this.game.players;
        players = players.filter((oPlayer) => oPlayer !== player);
        const c1 = Math.round(Math.random() * (players.length - 1));
        const c2 = Math.round(Math.random() * (players.length - 1));

        this.submitAction(player, {
          type: "game-one--turn",
          round: this.state.round,
          playersSelected: [players[c1], players[c2]],
        });
      }
    });
  }
}
