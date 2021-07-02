const GameNum = require("./game_num.js").GameNum;
const GameTwo = require('./game2.js');
const Allocation = require('./allocation.js').Allocation;
const Player = require("./player.js").Player;
const ROOM_WAIT_TIME_MILLISECONDS = require("./games_config.js").ROOM_WAIT_TIME_MILLISECONDS;
const DEFAULT_PLAYER_LOCATION = require("./games_config.js").DEFAULT_PLAYER_LOCATION;;


/**
 * @author Xi Pu
 * Class representing a room of 6 players. It contains data/information specific to a room/experiment session
 * allocateNewRoom in the lobby class is used to add new room instances
 * @see Lobby.allocateNewRoom
 */
class Room {
  gameNum = GameNum.GAMEONE;
  turnNum = 1; // the current turn number in this room starting at 1
  players = []; // holds player objects who are in this room
  oldPlayerLocations = new Map();
  newPlayerLocations = new Map();
  gameOneResults = []; // two groups for winners/losers, winners = gameOneResults[0], losers = gameOneResults[1]
  gameTwoPayoff = GameTwo.generateCompeteAndInvestPayoff();
  gameOneTurnCount = 0; // turns for game 1
  roomCreationTime = null;
  allPlayerTimes = new Map();
  /**
   * @constructor
   * @param roomName {string}
   */
  constructor(roomName) {
    if (roomName === undefined) {
      throw 'Room name not defined';
    }
    this.roomName = roomName;
    // getter method for a room's remaining lobby wait time in seconds
    this.getTime = function () {
      return (ROOM_WAIT_TIME_MILLISECONDS - ((Date.now() - this.roomCreationTime))) / 1000;
    }
  }

  get name() {
    return this.roomName;
  }

  get playerIDs() {
    return this.players.map(player => player.prolificID);
  }

  get playerCurrentLocations() {
    return this.newPlayerLocations;
  }

  getPlayerOldLocation(prolificID) {
    return this.oldPlayerLocations.get(prolificID);
  }

  getPlayerNewLocation(prolificID) {
    return this.newPlayerLocations.get(prolificID);
  }

  setPlayerLocation(prolificID, newLocation) {
    this.oldPlayerLocations.set(prolificID, this.newPlayerLocations.get(prolificID));
    this.newPlayerLocations.set(prolificID, newLocation);
  }

  initPlayerLocation(prolificID) {
    this.oldPlayerLocations.set(prolificID, DEFAULT_PLAYER_LOCATION);
    this.newPlayerLocations.set(prolificID, DEFAULT_PLAYER_LOCATION);
  }

  get roomCreationTime() {
    return this.roomCreationTime;
  }

  setRoomCreationTime(creationTime) {
    this.roomCreationTime = creationTime;
  }

  get GameOneTurnCount() {
    return this.gameOneTurnCount;
  }

  setGameOneTurnCount(newCount) {
    this.gameOneTurnCount = newCount;
  }

  /**
   * @param player Must be an instance of Player
   */
  addPlayer(player) {
    if (!(player instanceof Player)) {
      throw 'Parameter is not an instance of the Player class.';
    }
    this.players.push(player);
    this.initPlayerLocation(player.prolificID);
    this.allPlayerTimes.set(player.prolificID, Date.now());
    if (this.roomCreationTime == null) {
      this.setRoomCreationTime(Date.now());
    }
  }

  advanceToNextRound() {
    this.turnNum++;
  }

  advanceToGameTwo() {
    this.gameNum = GameNum.GAMETWO;
    this.turnNum = 0;
  }

  hasEveryoneConfirmed() {
    let result = true
    this.players.forEach((p) => {
      if (!p.isBot && !p.hasConfirmedAtTurn(this.gameNum, this.turnNum)) {
        result = false;
      }
    });
    return result;
  }

  hasPlayerWithIDConfirmed(prolificID) {
    if (!this.canFindPlayerWithID(prolificID)) {
      throw 'Player not found in room.'
    }
    let player = this.getPlayerWithID(prolificID);
    return player.isBot || player.hasConfirmedAtTurn(this.gameNum, this.turnNum);
  }

  canFindPlayerWithID(prolificID) {
    return this.players.some(player => player.prolificID === prolificID);
  }

  getPlayerWithID(prolificID) {
    return this.players.find(player => player.prolificID === prolificID);
  }

  getEveryoneChoiceAtCurrentTurn() {
    return new Map(
      this.players.map(player => [player.prolificID, player.getChoiceAtTurn(this.turnNum)])
    );
  }

  get gameOneResults() {
    return this.gameOneResults;
  }

  /**
   * Set who are the winners and losers for game 1. This will be used to form groups in game 2
   * @param results {[][]} an array of two arrays that represents winners and losers.
   * Example input: [['player1', 'player2', 'player4'], ['player3', 'player5', player6]]
   */
  setGameOneResults(results) {
    this.gameOneResults = results;
  }

  getTeamAllocationAtCurrentTurn() {
    return this.getTeamAllocationAtTurn(this.turnNum);
    // // winners
    // let winnerIDs = this.gameOneResults[0];
    // let winnerAllocations = [];
    // winnerIDs.forEach((id) => {
    //   winnerAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(this.turnNum));
    // });
    // let winnerSum = Allocation.sumAllocations(winnerAllocations);
    // // losers
    // let loserIDs = this.gameOneResults[1];
    // let loserAllocations = [];
    // loserIDs.forEach((id) => {
    //   loserAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(this.turnNum));
    // });
    // let loserSum = Allocation.sumAllocations(loserAllocations);
    // return [winnerSum.allocationAsArray, loserSum.allocationAsArray];
  }

  getTeamAllocationAtTurn(turnNum) {
    // winners
    let winnerIDs = this.gameOneResults[0];
    let winnerAllocations = [];
    winnerIDs.forEach((id) => {
      winnerAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(turnNum));
    });
    let winnerSum = Allocation.sumAllocations(winnerAllocations);
    // losers
    let loserIDs = this.gameOneResults[1];
    let loserAllocations = [];
    loserIDs.forEach((id) => {
      loserAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(turnNum));
    });
    let loserSum = Allocation.sumAllocations(loserAllocations);
    return [winnerSum, loserSum];
  }

  getPlayerTeamAllocationAtTurn(prolificID, turnNum) {
    // Retrieve teammate prolificIDs
    let teamIDs;
    let winnerIDs = this.gameOneResults[0];
    let loserIDs = this.gameOneResults[1];
    if (winnerIDs.indexOf(prolificID) > -1) {
      teamIDs = winnerIDs;
    } else {
      teamIDs = loserIDs;
    }
    // Sum up allocations
    let teamAllocations = [];
    teamIDs.forEach((id) => {
      teamAllocations.push(this.getPlayerWithID(id).getAllocationAtTurn(turnNum));
    });
    let sum = Allocation.sumAllocations(teamAllocations);
    return sum;
  }

  /**
   * @return {number[]} an array of two numbers. The first number is the compete payoff and the second number is the invest payoff
   */
  getCompeteAndInvestPayoffAtCurrentTurn() {
    return this.getCompeteAndInvestPayoffAtTurnNum(this.turnNum);
  }

  /**
   * @param turnNum {number}
   * @return {number[]} an array of two numbers. The first number is the compete payoff and the second number is the invest payoff
   */
  getCompeteAndInvestPayoffAtTurnNum(turnNum) {
    let idx = turnNum - 1; // turnNum is one-indexed
    return this.gameTwoPayoff[idx];
  }

  /**
   * gets player allocation at specific turn number 
   * @param {*} prolificID 
   * @param {*} turnNum 
   */
  getPlayerAllocationAtTurnNum(prolificID, turnNum) {
    let player = this.getPlayerWithID(prolificID);
    return player.getAllocationAtTurn(turnNum);
  }

  // need to refactor this code
  getOthersAllocationAtTurnNum(prolificID, turnNum) {
    let teammatesAllocation = [];
    let opponentsAllocation = [];
    if (this.gameOneResults[0].includes(prolificID)) {
      this.gameOneResults[0].forEach((id) => {
        if (id !== prolificID) { // excluding self
          let teammate = this.getPlayerWithID(id);
          teammatesAllocation.push(teammate.getAllocationAtTurn(turnNum));
        }
      });
      this.gameOneResults[1].forEach((id) => {
        let opponent = this.getPlayerWithID(id);
        opponentsAllocation.push(opponent.getAllocationAtTurn(turnNum));
      });
    } else {
      this.gameOneResults[1].forEach((id) => {
        if (id !== prolificID) { // excluding self
          let teammate = this.getPlayerWithID(id);
          teammatesAllocation.push(teammate.getAllocationAtTurn(turnNum));
        }
      });
      this.gameOneResults[0].forEach((id) => {
        let opponent = this.getPlayerWithID(id);
        opponentsAllocation.push(opponent.getAllocationAtTurn(turnNum));
      });
    }
    return [teammatesAllocation, opponentsAllocation];
  }
}


module.exports = {
  Room,
}