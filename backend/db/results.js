const e = require('express');
const DB_API = require('../db/db_api.js');
const choice = require('./models/choice.js');
const lobby = require('../lobby.js').LobbyInstance;

function getResultsByProlificId(prolificIDArray, room) {
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    let allLocations = room.playerLocation;
    let allResults = [];

    for (let i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let playerRoundResult = calculateDoubleAndTripleBonusesOfID(playerProlific, allChoices);

        let playerInitialLocation = allLocations.get(playerProlific);
        let newPlayerLocation = playerInitialLocation + playerRoundResult;
        room.setPlayerLocation(playerProlific, newPlayerLocation);
        allResults.push(newPlayerLocation);
    }
    return allResults;
}

function calculateDoubleAndTripleBonusesOfID(playerProlific, allChoices) {
    let choicesProlific = allChoices.get(playerProlific);
    let count = 0;
    for (var i = 0; i < choicesProlific.length; i++) {
        let playerChosen = choicesProlific[i];
        let choicesChosenPlayer = allChoices.get(playerChosen);
        for (var j = 0; j < choicesChosenPlayer.length; j++) {
            if (choicesChosenPlayer[j] === (playerProlific)) {
                count += 15;
            }
        }
    }
    if (count === 30) {
        console.log('TRIPLE BONUS');
        return (count);
    }
    return count;
}

function calculateSingleBonusesOfID(playerProlific, allChoices, prolificIDArray) {

}

function calculateAllTripleBonuses(prolificIDArray, room) {
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    let allTripleBonuses = [];

    for (let i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let choicesProlific = allChoices.get(playerProlific);
        let tempTripleBonus = [];
        if (choicesProlific.length == 2) {
            let firstPlayerChosen = choicesProlific[0];
            let secondPlayerChosen = choicesProlific[1];
            let firstPlayerChoices = allChoices.get(firstPlayerChosen);
            let secondPlayerChoices = allChoices.get(secondPlayerChosen);
            if (firstPlayerChoices.length == 2 && secondPlayerChoices.length == 2) {
                let triple = true;
                for (var k = 0; k < 2; k++) {
                    if (firstPlayerChoices[k] != playerProlific && firstPlayerChoices[k] != secondPlayerChosen) {
                        triple = false;
                    }
                    if (secondPlayerChoices[k] != playerProlific && secondPlayerChoices[k] != firstPlayerChosen) {
                        triple = false;
                    }
                }
                if (triple) {
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
            }

        }
    }
    return allTripleBonuses;
}

function isGameOneDone(room) {
    let allLocations = room.playerLocation;
    var playerMax = 0;
    for (let location of allLocations.values()) {
        if (location >= 100) {
            playerMax += 1;
        }
    }
    return playerMax >= 3;
}

function getWinnersAndLosers(room) {
    let allLocations = room.playerLocation;
    let winners = [];
    let losers = [];
    for (let tempPlayer of allLocations.keys()) {
        if (allLocations.get(tempPlayer) >= 100) {
            winners.push(tempPlayer);
        }
        else {
            losers.push(tempPlayer);
        }
    }
    return [winners, losers];
}


module.exports = {
    getResultsByProlificId: getResultsByProlificId,
    isGameOneDone: isGameOneDone,
    getWinnersAndLosers: getWinnersAndLosers,
    calculateAllTripleBonuses: calculateAllTripleBonuses,
}
