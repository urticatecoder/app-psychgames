const Allocation = require('./allocation.js').Allocation;
const GameNum = require("./game_num.js").GameNum;
const DEFAULT_PLAYER_LOCATION = require("./games_config.js").DEFAULT_PLAYER_LOCATION;


/**
 * @author Xi Pu
 * Class representing an individual player.
 * It contains data/information specific to a player, e.g. prolificID, choices and allocations he/she made in each turn of game 1 and 2.
 */
class Player {
  oldLocation = DEFAULT_PLAYER_LOCATION;
  newLocation = DEFAULT_PLAYER_LOCATION;
  choices = []; // stores an array of array to represent choices made by this player in game 1
  allocations = []; // stores an array of array to represent allocations of tokens made by this player in game 2
  keepTotal = 0; // stores the total keep of game2 
  investTotal = 0; // stores the total invest of game2 
  competeTotal = 0; // stores the total compete of game2 
  investRate = 0; // stores the total keep of game2 
  competeRate = 0; // stores the total keep of game2 
  /**
   * @constructor
   * @param prolificID {string}
   */
  constructor(prolificID) {
    if (prolificID === undefined) {
      throw 'prolificID not defined';
    }
    this.prolificID = prolificID;
    this.isBot = false;
  }

  /**
   * @param isBot {boolean}
   */
  setIsBot(isBot) {
    if (typeof (isBot) !== 'boolean') {
      throw 'Parameter is not a Boolean type.';
    }
    this.isBot = isBot;
  }

  updateLocation(newLocation) {
    this.oldLocation = this.newLocation;
    this.newLocation = newLocation;
  }

  updateCompeteAmount(competeValue) {
    this.competeTotal = this.competeTotal + competeValue;
  }

  getCompeteAmount() {
    return this.competeTotal;
  }

  updateKeepAmount(keepValue) {
    this.keepTotal = this.keepTotal + keepValue;
  }

  getKeepAmount() {
    return this.keepTotal;
  }

  updateInvestAmount(investValue) {
    this.investTotal = this.investTotal + investValue;
  }

  getInvestAmount() {
    return this.investTotal;
  }

  /**
   * @param {integer} turnNum 
   * @returns true if player has confirmed game 1 choice for the specified turn
   */
  hasConfirmedAtTurn(gameNum, turnNum) {
    if (gameNum == GameNum.GAMEONE) {
      return this.getGameOneChoiceCount() >= turnNum;
    } else {
      return this.getGameTwoChoiceCount() >= turnNum;
    }
  }

  getGameOneChoiceCount() {
    return this.choices.length;
  }

  getGameTwoChoiceCount() {
    return this.allocations.length;
  }

  /**
   * @param {string[]} choice an array of selected players' IDs in game 1
   */
  recordChoices(choice) {
    if (!(choice instanceof Array)) {
      throw 'Parameter is not an Array.';
    }
    this.choices.push(choice);
  }

  /**
   * @param {integer} turnNum
   * @return {string[]}
   */
  getChoiceAtTurn(turnNum) {
    if (!this.hasConfirmedAtTurn(GameNum.GAMEONE, turnNum)) {
      throw 'Player has not confirmed choice for this turn.';
    }
    return this.choices[turnNum - 1];
  }

  /**
   * @param compete {number}
   * @param keep {number}
   * @param invest {number}
   */
  recordAllocation(compete, keep, invest) {
    this.allocations.push(new Allocation(compete, keep, invest));
  }

  getAllocationAtTurn(turnNum) {
    if (turnNum <= 0) {
      throw 'Invalid turn num.';
    }
    if (!this.hasConfirmedAtTurn(GameNum.GAMETWO, turnNum)) {
      throw 'Player has not confirmed allocation for this turn.';
    }
    return this.allocations[turnNum - 1];
  }
}

module.exports = {
  Player,
}