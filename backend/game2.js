/**
 * @author Xi Pu
 * This file contains a data class for game 2 and a few helper functions to calculate stats related to game 2
 */

/**
 * Class representing the amount of tokens allocated for each token category.
 * It has a few static helper functions for aggregating instances of GameTwoAllocation
 */
class GameTwoAllocation {
    static TOKEN_VALUE = 0.5;
    static POSSIBLE_PAYOFF = [0, 0.5, 1, 1.5, 2];
    static MAX_NUM_OF_TURNS = 2;

    constructor(compete, keep, invest) {
        this.compete = compete;
        this.keep = keep;
        this.invest = invest;
    }

    get numOfCompeteToken() {
        return this.compete;
    }

    get numOfKeepToken() {
        return this.keep;
    }

    get numOfInvestToken() {
        return this.invest;
    }

    get allocationAsArray() {
        return [this.compete, this.keep, this.invest];
    }

    /**
     * @param allocation1 must be an instance of GameTwoAllocation
     * @param allocation2 must be an instance of GameTwoAllocation
     * @return {GameTwoAllocation}
     */
    static addAllocations(allocation1, allocation2) {
        if (!(allocation1 instanceof GameTwoAllocation) || !(allocation2 instanceof GameTwoAllocation)) {
            throw 'Not an instance of GameTwoAllocation.';
        }
        return new GameTwoAllocation(allocation1.numOfCompeteToken + allocation2.numOfCompeteToken,
            allocation1.numOfKeepToken + allocation2.numOfKeepToken,
            allocation1.numOfInvestToken + allocation2.numOfInvestToken);
    }

    /**
     * @param allocations {GameTwoAllocation[]}
     * @return {GameTwoAllocation}
     */
    static sumAllocations(allocations) {
        let sum = new GameTwoAllocation(0, 0, 0);
        allocations.forEach((allocation) => {
            sum = GameTwoAllocation.addAllocations(sum, allocation);
        });
        return sum;
    }
}

function calculateFinalPaymentForAPlayer(prolificID, lobby) {
    let turnNum = getRandomInt(GameTwoAllocation.MAX_NUM_OF_TURNS - 1) + 1; // select a random turn num to calculate final payment
    let room = lobby.getRoomPlayerIsIn(prolificID);
    return calculatePaymentForAPlayerAtTurn(prolificID, room, turnNum);
}

/**
 * @param prolificID {string}
 * @param room Must be a room instance
 * @param turnNum {number}
 * @returns {number} payment for the player
 */
function calculatePaymentForAPlayerAtTurn(prolificID, room, turnNum) {
    let tokenValue = GameTwoAllocation.TOKEN_VALUE;
    let payoff = room.getCompeteAndInvestPayoffAtTurnNum(turnNum);
    let competePayoff = payoff[0], investPayoff = payoff[1];
    let playerAllocation = room.getPlayerAllocationAtTurnNum(prolificID, turnNum);
    let payment = 0;
    payment += (tokenValue * playerAllocation.numOfKeepToken + investPayoff * playerAllocation.numOfInvestToken + competePayoff * playerAllocation.numOfCompeteToken);

    let allocations = room.getOthersAllocationAtTurnNum(prolificID, turnNum);
    let teammatesAllocations = allocations[0];
    let opponentsAllocations = allocations[1];
    teammatesAllocations.forEach((allocation) => {
        // add compete and invest tokens allocated by your teammates
        payment += (investPayoff * allocation.numOfInvestToken);
        payment += (competePayoff * allocation.numOfCompeteToken);
    });

    // opponents impact
    opponentsAllocations.forEach((allocation) => {
        payment -= (competePayoff * allocation.numOfCompeteToken);
    });

    return payment;
}

/**
 * @return {number[]} an array consists of 3 integers, representing the amount of tokens allocated for each category
 */
function generateBotAllocation() {
    let i = 3; // there are 3 types of tokens
    let totalAvailableTokens = 10;
    let allocation = [];
    while (i-- > 1) {
        let num = getRandomInt(totalAvailableTokens);
        totalAvailableTokens -= num;
        allocation.push(num);
    }
    allocation.push(totalAvailableTokens);
    shuffleArray(allocation);
    return allocation;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1)); // plus 1 here to include max in the possible range
}

function generateCompeteAndInvestPayoff() {
    let allPairs = [];
    GameTwoAllocation.POSSIBLE_PAYOFF.forEach((competePayoff) => {
        GameTwoAllocation.POSSIBLE_PAYOFF.forEach((investPayoff) => {
            allPairs.push([competePayoff, investPayoff]);
        });
    });

    shuffleArray(allPairs);
    return allPairs;
}

/**
 * Shuffle an array in place. This function will not return anything.
 * Adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param array {Object[]}
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isGameTwoDone(room) {
    return room.turnNum >= GameTwoAllocation.MAX_NUM_OF_TURNS;
}

module.exports = {
    GameTwoAllocation,
    generateCompeteAndInvestPayoff: generateCompeteAndInvestPayoff,
    calculatePaymentForAPlayerAtTurn: calculatePaymentForAPlayerAtTurn,
    generateBotAllocation: generateBotAllocation,
    isGameTwoDone: isGameTwoDone,
    getRandomInt: getRandomInt,
    calculateFinalPaymentForAPlayer: calculateFinalPaymentForAPlayer,
}
