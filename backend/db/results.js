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
                    console.log(allDoubleBonuses[idx][0]);
                    console.log(allDoubleBonuses[idx][1]);

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
