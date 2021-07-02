/**
 * @author Xi Pu
 * This file contains a data class for game 2 and a few helper functions to calculate stats related to game 2
 */

const GamesConfig = require('./games_config.js');
const Allocation = require('./allocation').Allocation;


function calculateFinalPaymentForAPlayer(prolificID, lobby) {
    let turnNum = getRandomInt(GamesConfig.GAME_TWO_MAX_ROUND_NUM - 1) + 1; // select a random turn num to calculate final payment
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
    let tokenValue = Allocation.TOKEN_VALUE;
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

function getCompeteAtTurn(prolificID, room, turnNum) {
    let group = room.getOthersAllocationAtTurnNum(prolificID, turnNum);
    let teammates = group[0];
    let competeAmount = 0;
    for (var i = 0; i < teammates.length; i++) {
        competeAmount += teammates[i].compete;
    }
    console.log(competeAmount);
    return competeAmount;
}

function getInvestAtTurn(prolificID, room, turnNum) {
    let group = room.getOthersAllocationAtTurnNum(prolificID, turnNum);
    let teammates = group[0];
    let investAmount = 0;
    for (var i = 0; i < teammates.length; i++) {
        investAmount += teammates[i].invest;
    }
    console.log(investAmount);
    return investAmount;
}

function getKeepAtTurn(prolificID, room, turnNum) {
    let group = room.getOthersAllocationAtTurnNum(prolificID, turnNum);
    let teammates = group[0];
    let keepAmount = 0;
    for (var i = 0; i < teammates.length; i++) {
        keepAmount += teammates[i].keep;
    }
    console.log(keepAmount);
    return keepAmount;
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
    Allocation.POSSIBLE_PAYOFF.forEach((competePayoff) => {
        Allocation.POSSIBLE_PAYOFF.forEach((investPayoff) => {
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
    return room.turnNum >= GamesConfig.GAME_TWO_MAX_ROUND_NUM;
}

module.exports = {
    generateCompeteAndInvestPayoff: generateCompeteAndInvestPayoff,
    calculatePaymentForAPlayerAtTurn: calculatePaymentForAPlayerAtTurn,
    generateBotAllocation: generateBotAllocation,
    isGameTwoDone: isGameTwoDone,
    getRandomInt: getRandomInt,
    calculateFinalPaymentForAPlayer: calculateFinalPaymentForAPlayer,
    getCompeteAtTurn: getCompeteAtTurn,
    getInvestAtTurn: getInvestAtTurn,
    getKeepAtTurn: getKeepAtTurn
}
