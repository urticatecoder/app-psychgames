/**
 * @author Nick DeCapite
 * A schema for calculating the location of each player based on their choices
 * The schema is of choice.js is inputted
 * See comments for a description of what each method represents
 */
const e = require('express');
const { all } = require('./app.js');
const DB_API = require('./db/db_api.js');
const choice = require('./db/models/choice.js');
const lobby = require('./lobby.js').LobbyInstance;
const GamesConfig = require('./games_config.js');
const GameOneTurnResult = require('./game_one_turn_result.js').GameOneTurnResult;

function computeResults(roomName) {
    const room = lobby.getRoomByRoomName(roomName);
    const players = lobby.getAllPlayersInRoom(roomName);
    const allIDs = players.map(player => player.prolificID);
    let singleChoiceCounts = countSingleChoices(room);
    // emit list of lists of prolificIDs and integers of how much to move up for triple bonuses
    let allTripleBonuses = calculateAllTripleBonuses(allIDs, room);
    let tripleBonusCounts = countTripleBonuses(allTripleBonuses, room);
    // emit list of lists of prolificIDs and integers of how much to move up for double bonuses
    let allDoubleBonuses = calculateAllDoubleBonuses(allIDs, room);
    let doubleBonusCounts = countDoubleBonuses(allDoubleBonuses, room);
    // players will be emitted to the "net zero" position after showing who selected who (to be implemented)
    let resultsForAllPlayers = getResultsByProlificId(allIDs, room);
    const results = new GameOneTurnResult(singleChoiceCounts, doubleBonusCounts, allDoubleBonuses, tripleBonusCounts, allTripleBonuses, resultsForAllPlayers);
    return results;
}

function recordPlayerChoices(prolificID, choices) {
    let player = lobby.getPlayerByProlificID(prolificID);
    player.setIsBot(false);
    player.recordChoices(choices);
}

/**
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns allResults {int array} of locations to move each player
 */
function getResultsByProlificId(prolificIDArray, room) {
    let allLocations = room.playerLocations;
    let roundResults = [];
    let initialLocations = [];
    for (let i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let playerRoundResult = getResults(playerProlific, prolificIDArray, room);
        roundResults.push(playerRoundResult);

        let playerInitialLocation = allLocations.get(playerProlific);
        initialLocations.push(playerInitialLocation);
    }
    let zeroSumRoundResults = zeroSumResults(roundResults, prolificIDArray, room);
    let newResults = [];
    for (var i = 0; i < zeroSumRoundResults.length; i++) {
        newResults.push(zeroSumRoundResults[i] + initialLocations[i]);
        let playerProlific = prolificIDArray[i];
        if (newResults[i] < 0) {
            room.setPlayerLocation(playerProlific, 0);
        } else {
            room.setPlayerLocation(playerProlific, newResults[i]);
        }
    }
    return newResults;
}

/**
 * @param playerProlific {string} ID of player
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns count {int} location for player to move
 */
function getResults(playerProlific, prolificIDArray, room) {
    let singlePair = getSinglePairMap(prolificIDArray, room);
    let doublePair = getDoublePairMap(prolificIDArray, room);
    let triplePair = getTriplePairMap(prolificIDArray, room);

    var count = 0;
    count += singlePair.get(playerProlific) * 4;
    count += doublePair.get(playerProlific) * 8;
    count += triplePair.get(playerProlific) * 15;
    return count;
}

/**
 * @param all
 */
function zeroSumResults(allResults, prolificIDArray, room) {
    var average = 0;
    for (var i = 0; i < allResults.length; i++) {
        average += allResults[i];
    }
    average = average / allResults.length;

    var newResults = [];
    for (var i = 0; i < allResults.length; i++) {
        let playerProlific = prolificIDArray[i];
        let newLocation = allResults[i] - average;
        newResults.push(newLocation);
    }
    return newResults;
}

/**
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns singleMap of single bonuses every player has
 */
function getSinglePairMap(prolificIDArray, room) {
    let doubleAndTripleCount;
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    var singleMap = new Map();
    for (var i = 0; i < prolificIDArray.length; i++) {
        singleMap.set(prolificIDArray[i], 0);
    }
    doubleAndTripleCount = getDoubleAndTripleCount(prolificIDArray, room);

    for (var i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let playerProlificChoices = allChoices.get(playerProlific);
        for (var k = 0; k < playerProlificChoices.length; k++) {
            let playerChosen = playerProlificChoices[k];
            singleMap.set(playerChosen, singleMap.get(playerChosen) + 1);
        }
    }
    let tripleMap = getTriplePairMap(prolificIDArray, room);
    //remove the double and triple bonuses
    for (var i = 0; i < prolificIDArray.length; i++) {
        let tempPlayer = prolificIDArray[i];
        let tempCount = doubleAndTripleCount.get(tempPlayer);
        if (tripleMap.get(tempPlayer) !== 0) {
            singleMap.set(tempPlayer, singleMap.get(tempPlayer) - tempCount + 1);
        } else {
            singleMap.set(tempPlayer, singleMap.get(tempPlayer) - tempCount);
        }
    }

    return singleMap;
}

/**
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns doubleAndTripleMap of double and triple bonuses every player has
 */
function getDoubleAndTripleCount(prolificIDArray, room) {
    var doubleAndTripleMap = new Map();
    var singleMap = new Map();
    //initialize maps
    for (var i = 0; i < prolificIDArray.length; i++) {
        doubleAndTripleMap.set(prolificIDArray[i], 0);
        singleMap.set(prolificIDArray[i], 0);
    }
    let doublePairs = calculateAllDoubleBonuses(prolificIDArray, room);
    let triplePairs = calculateAllTripleBonuses(prolificIDArray, room);
    // place double pairs into doubleAndTriple map
    for (var i = 0; i < doublePairs.length; i++) {
        doubleAndTripleMap.set(doublePairs[i][0], doubleAndTripleMap.get(doublePairs[i][0]) + 1);
        doubleAndTripleMap.set(doublePairs[i][1], doubleAndTripleMap.get(doublePairs[i][1]) + 1);
    }
    //place triple pairs into doubleAndTripleMap
    for (var i = 0; i < triplePairs.length; i++) {
        doubleAndTripleMap.set(triplePairs[i][0], doubleAndTripleMap.get(triplePairs[i][0]) + 1);
        doubleAndTripleMap.set(triplePairs[i][1], doubleAndTripleMap.get(triplePairs[i][1]) + 1);
        doubleAndTripleMap.set(triplePairs[i][2], doubleAndTripleMap.get(triplePairs[i][2]) + 1);
    }
    return doubleAndTripleMap;
}

/**
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns tripleMap of double bonuses every player has
 */
function getDoublePairMap(prolificIDArray, room) {
    var doubleMap = new Map();
    for (var i = 0; i < prolificIDArray.length; i++) {
        doubleMap.set(prolificIDArray[i], 0);
    }
    let doubleAndTriple = getDoubleAndTripleCount(prolificIDArray, room);
    let triple = getTriplePairMap(prolificIDArray, room);
    // put double and triple counts into double map
    for (var i = 0; i < prolificIDArray.length; i++) {
        let tempPlayer = prolificIDArray[i];
        doubleMap.set(tempPlayer, doubleAndTriple.get(tempPlayer) - 3 * triple.get(tempPlayer));
    }
    return doubleMap;
}

/**
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns tripleMap of triple bonuses every player has
 */
function getTriplePairMap(prolificIDArray, room) {
    var tripleMap = new Map();
    for (var i = 0; i < prolificIDArray.length; i++) {
        tripleMap.set(prolificIDArray[i], 0);
    }
    let triplePairs = calculateAllTripleBonuses(prolificIDArray, room);
    // place double pairs into doubleAndTriple map
    for (var i = 0; i < triplePairs.length; i++) {
        tripleMap.set(triplePairs[i][0], tripleMap.get(triplePairs[i][0]) + 1);
        tripleMap.set(triplePairs[i][1], tripleMap.get(triplePairs[i][1]) + 1);
        tripleMap.set(triplePairs[i][2], tripleMap.get(triplePairs[i][2]) + 1);
    }
    return tripleMap;
}

function countSingleChoices(room) {
    let prolificIDs = room.playerIDs;
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    let counts = new Map();
    prolificIDs.forEach((prolificID) => { counts.set(prolificID, 0); });
    allChoices.forEach((choice) => {
        choice.forEach((chosenID) => {
            counts.set(chosenID, counts.get(chosenID) + 1);
        });
    })
    return counts;
}

/**
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns allDoubleBonuses for list of players who selected each other after each round
 */
function calculateAllDoubleBonuses(prolificIDArray, room) {
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    let allDoubleBonuses = [];

    for (let i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let choicesProlific = allChoices.get(playerProlific);
        let double = true;
        let triple = false;
        if (choicesProlific == 2) {
            let firstPlayerChosen;
            let secondPlayerChosen;
            ({ firstPlayerChosen, secondPlayerChosen, triple } = isTripleBonus(choicesProlific, allChoices, triple, playerProlific));
        }
        if (!triple) {
            for (var j = 0; j < choicesProlific.length; j++) {
                double = true;
                let playerChosen = choicesProlific[j];
                let choicesChosenPlayer = allChoices.get(playerChosen);
                let tempDoubleBonus = [];
                for (var k = 0; k < choicesChosenPlayer.length; k++) {
                    if (choicesChosenPlayer[k] === (playerProlific)) {
                        tempDoubleBonus.push(playerProlific);
                        tempDoubleBonus.push(playerChosen);
                    }
                }
                //place into double bonus list if not already in it
                for (var idx = 0; idx < allDoubleBonuses.length; idx++) {
                    if (allDoubleBonuses[idx][0] == playerProlific || allDoubleBonuses[idx][1] == playerProlific) {
                        if (allDoubleBonuses[idx][1] == playerChosen || allDoubleBonuses[idx][0] == playerChosen) {
                            double = false;
                        }
                    }
                }
                if (double && tempDoubleBonus.length != 0) {
                    allDoubleBonuses.push(tempDoubleBonus);
                }
            }
        }
    }
    return allDoubleBonuses;
}

/**
 * Count the number of double bonuses awarded to each player in the room in a given turn
 * @param {string[][]} doubleBonuses Nested arrays containing double bonuses in a given turn
 * @param {Room} room the room the players are in
 * @returns Mapping of player prolificID to the count of double bonuses 
 */
function countDoubleBonuses(doubleBonuses, room) {
    let prolificIDs = room.playerIDs;
    let counts = new Map();
    prolificIDs.forEach((prolificID) => { counts.set(prolificID, 0); });
    doubleBonuses.forEach((tuple) => {
        counts.set(tuple[0], counts.get(tuple[0]) + 1);
        counts.set(tuple[1], counts.get(tuple[1]) + 1);
    })
    return counts;
}

/**
 * @param prolificIDArray {string array} in the format of prolific IDs e.g. "['testID1', 'testID2']"
 * @param room {room object} the room the players are in 
 * @returns allTripleBonuses for list of players who selected each other for a triple bonus after each round
 */
function calculateAllTripleBonuses(prolificIDArray, room) {
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    let allTripleBonuses = [];
    for (let i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let choicesProlific = allChoices.get(playerProlific);
        let tempTripleBonus = [];
        if (choicesProlific.length == 2) {
            const firstPlayerChosen = choicesProlific[0];
            const secondPlayerChosen = choicesProlific[1];
            if (isTripleBonus(choicesProlific, allChoices, playerProlific)) {
                placeIntoTripleBonus(allTripleBonuses, playerProlific, firstPlayerChosen, secondPlayerChosen, tempTripleBonus);
            }
        }
    }
    return allTripleBonuses;
}

/**
 * @param choicesProlific {string array} of IDs a player chose
 * @param allChoices {map} of all choices of players
 * @param playerProlific {string} ID
 * @returns firstPlayerChosen, secondPlayerChosen, triple in order to determine if Triple Bonus  
 **/
function isTripleBonus(choicesProlific, allChoices, playerProlific) {
    let firstPlayerChosen = choicesProlific[0];
    let secondPlayerChosen = choicesProlific[1];
    let firstPlayerChoices = allChoices.get(firstPlayerChosen);
    let secondPlayerChoices = allChoices.get(secondPlayerChosen);
    if (firstPlayerChoices.length == 2 && secondPlayerChoices.length == 2) {
        for (var k = 0; k < 2; k++) {
            if (firstPlayerChoices[k] != playerProlific && firstPlayerChoices[k] != secondPlayerChosen) {
                return false;
            }
            if (secondPlayerChoices[k] != playerProlific && secondPlayerChoices[k] != firstPlayerChosen) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
}
/**
 * @param allTripleBonuses {string array} of players who selected each other for triple bonus
 * @param playerProlific {string} ID
 * @param firstPlayerChosen {string}
 * @param secondPlayerChosen {string}
 * @param tempTripleBonus {string array} of players who have triple bonuses so far
 **/
function placeIntoTripleBonus(allTripleBonuses, playerProlific, firstPlayerChosen, secondPlayerChosen, tempTripleBonus) {
    let duplicate = false;
    for (var j = 0; j < allTripleBonuses.length; j++) {
        if (allTripleBonuses[j].includes(playerProlific) || allTripleBonuses[j].includes(firstPlayerChosen
            || allTripleBonuses[j].includes(secondPlayerChosen))) {
            duplicate = true;
        }
    }
    if (!duplicate) {
        tempTripleBonus.push(playerProlific);
        tempTripleBonus.push(firstPlayerChosen);
        tempTripleBonus.push(secondPlayerChosen);
        allTripleBonuses.push(tempTripleBonus);
    }
}

/**
 * Count the number of triple bonuses awarded to each player in the room in a given turn
 * @param {string[][]} tripleBonuses Nested arrays containing triple bonuses in a given turn
 * @param {Room} room the room the players are in
 * @returns Mapping of player prolificID to the count of triple bonuses
 */
function countTripleBonuses(tripleBonuses, room) {
    let prolificIDs = room.playerIDs;
    let counts = new Map();
    prolificIDs.forEach((prolificID) => { counts.set(prolificID, 0); });
    tripleBonuses.forEach((tuple) => {
        counts.set(tuple[0], counts.get(tuple[0]) + 1);
        counts.set(tuple[1], counts.get(tuple[1]) + 1);
        counts.set(tuple[2], counts.get(tuple[2]) + 1);
    })
    return counts;
}

/**
 * @param room {room object} the room the players are in 
 * @returns playerMax {int} for how many players have won
 */
function isGameOneDone(room) {
    let allLocations = room.playerLocations;
    var playerMax = 0;
    for (let location of allLocations.values()) {
        if (location >= 100) {
            playerMax += 1;
        }
    }
    return playerMax >= GamesConfig.GAME_ONE_MIN_WINNER_NUM || room.turnNum >= GamesConfig.GAME_ONE_MAX_TURN_NUM;
}

/**
 * @param room {room object} the room the players are in 
 * @returns winners, losers {string List}
 */
function getWinnersAndLosers(roomName) {
    room = lobby.getRoomByRoomName(roomName);
    if (room.gameOneResults != null) {
        return room.gameOneResults;
    }
    let allLocations = room.playerLocations;
    let winners = [];
    let losers = [];
    let highScores = [];
    for (let tempPlayer of allLocations.keys()) {
        highScores.push(allLocations.get(tempPlayer));
    }
    highScores.sort(function (a, b) {
        return b - a;
    });

    for (let tempPlayer of allLocations.keys()) {
        if (allLocations.get(tempPlayer) >= highScores[2] && winners.length < 3) {
            winners.push(tempPlayer);
        } else {
            losers.push(tempPlayer);
        }
    }
    room.setGameOneResults(winners, losers);
    return [winners, losers];
}

function isWinner(prolificID, room) {
    let results = getWinnersAndLosers(room.roomName);
    let winners = results[0];
    for (var i = 0; i < winners.length; i++) {
        if (winners[i] === prolificID) {
            return true;
        }
    }
    return false;
}

function winningBonus(prolificID, room) {
    if (isWinner(prolificID, room)) {
        return 5; // 5 dollars for winning game 1
    } else {
        return 0;
    }
}


module.exports = {
    computeResults: computeResults,
    recordPlayerChoices: recordPlayerChoices,
    getResultsByProlificId: getResultsByProlificId,
    isGameOneDone: isGameOneDone,
    getWinnersAndLosers: getWinnersAndLosers,
    calculateAllTripleBonuses: calculateAllTripleBonuses,
    calculateAllDoubleBonuses: calculateAllDoubleBonuses,
    countTripleBonuses: countTripleBonuses,
    countDoubleBonuses: countDoubleBonuses,
    countSingleChoices: countSingleChoices,
    calculateResults: getSinglePairMap,
    getResults: getResults,
    zeroSumResults: zeroSumResults,
    getSinglePairMap: getSinglePairMap,
    getDoublePairMap: getDoublePairMap,
    getTriplePairMap: getTriplePairMap,
    isWinner: isWinner,
    winningBonus: winningBonus
}
