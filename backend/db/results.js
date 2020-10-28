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

function calculateResults(prolificIDArray, room){
    var singleMap = new Map();
    var doubleAndTripleMap = new Map();
    var tripleMap = new Map();
    for(var i = 0; i < 6; i++){
        singleMap.set(prolificIDArray[i], 0);
        doubleAndTripleMap.set(prolificIDArray[i], 0);
        tripleMap.set(prolificIDArray[i], 0);
    }
    let doublePairs = calculateAllDoubleBonuses(prolificIDArray, room);
    let triplePairs = calculateAllTripleBonuses(prolificIDArray, room);
    // place double pairs into doubleAndTriple map
    for(var i = 0; i < doublePairs.length; i++){
        doubleAndTripleMap.set(doublePairs[i][0], doubleAndTripleMap.get(doublePairs[i][0]) + 1);
        doubleAndTripleMap.set(doublePairs[i][1], doubleAndTripleMap.get(doublePairs[i][1]) + 1);
    }
    //place triple pairs into doubleAndTripleMap
    for(var i = 0; i < triplePairs.length; i++){
        doubleAndTripleMap.set(triplePairs[i][0], doubleAndTripleMap.get(triplePairs[i][0]) + 1);
        doubleAndTripleMap.set(triplePairs[i][1], doubleAndTripleMap.get(triplePairs[i][1]) + 1);
        doubleAndTripleMap.set(triplePairs[i][2], doubleAndTripleMap.get(triplePairs[i][2]) + 1);
    }

}

function calculateDoubleAndTripleBonusesOfID(playerProlific, allChoices) {
    let choicesProlific = allChoices.get(playerProlific);
    let count = 0;
    for (var i = 0; i < choicesProlific.length; i++) {
        let playerChosen = choicesProlific[i];
        let choicesChosenPlayer = allChoices.get(playerChosen);
        for (var j = 0; j < choicesChosenPlayer.length; j++) {
            if (choicesChosenPlayer[j] === (playerProlific)) {
                count += 8;
            }
        }
    }
    if (count === 16) {
        console.log('TRIPLE BONUS');
        return (count - 1);
    }
    return count;
}

function calculateAllDoubleBonuses(prolificIDArray, room) {
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    let allDoubleBonuses = [];

    for (let i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let choicesProlific = allChoices.get(playerProlific);
        let double = true;
        let triple = false;
        if(choicesProlific == 2){
            let firstPlayerChosen;
            let secondPlayerChosen;
            ({ firstPlayerChosen, secondPlayerChosen, triple } = isTripleBonus(choicesProlific, allChoices, triple, playerProlific));
        }
        if(!triple){
            for (var j = 0; j < choicesProlific.length; j++) {
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
                    if(allDoubleBonuses[idx][0] == playerProlific || allDoubleBonuses[idx][1] ==playerProlific){
                        if(allDoubleBonuses[idx][1] == playerChosen || allDoubleBonuses[idx][0] ==playerChosen){
                            double = false;
                        }
                    }
                }
                if(double){
                    allDoubleBonuses.push(tempDoubleBonus);
                }
            }
        }
    }
    return allDoubleBonuses;
}

function calculateAllTripleBonuses(prolificIDArray, room) {
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    let allTripleBonuses = [];
    for (let i = 0; i < prolificIDArray.length; i++) {
        let playerProlific = prolificIDArray[i];
        let choicesProlific = allChoices.get(playerProlific);
        let tempTripleBonus = [];
        let triple = false;
        if (choicesProlific.length == 2) {
            let firstPlayerChosen;
            let secondPlayerChosen;
            ({ firstPlayerChosen, secondPlayerChosen, triple } = isTripleBonus(choicesProlific, allChoices, triple, playerProlific));
            placeIntoTripleBonus(triple, allTripleBonuses, playerProlific, firstPlayerChosen, secondPlayerChosen, tempTripleBonus);
        }
    }
    return allTripleBonuses;
}

function isTripleBonus(choicesProlific, allChoices, triple, playerProlific) {
    let firstPlayerChosen = choicesProlific[0];
    let secondPlayerChosen = choicesProlific[1];
    let firstPlayerChoices = allChoices.get(firstPlayerChosen);
    let secondPlayerChoices = allChoices.get(secondPlayerChosen);
    if (firstPlayerChoices.length == 2 && secondPlayerChoices.length == 2) {
        triple = true;
        for (var k = 0; k < 2; k++) {
            if (firstPlayerChoices[k] != playerProlific && firstPlayerChoices[k] != secondPlayerChosen) {
                triple = false;
            }
            if (secondPlayerChoices[k] != playerProlific && secondPlayerChoices[k] != firstPlayerChosen) {
                triple = false;
            }
        }
    }
    return { firstPlayerChosen, secondPlayerChosen, triple };
}

function placeIntoTripleBonus(triple, allTripleBonuses, playerProlific, firstPlayerChosen, secondPlayerChosen, tempTripleBonus) {
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
    calculateAllDoubleBonuses: calculateAllDoubleBonuses,
}
