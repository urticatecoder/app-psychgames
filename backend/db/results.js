const DB_API = require('../db/db_api.js');
const choice = require('./models/choice.js');
const lobby = require('../lobby.js').LobbyInstance;

function getResultsByProlificId(prolificIDArray, room) {
    let allChoices = room.getEveryoneChoiceAtCurrentTurn();

    // let allChoices = DB_API.findChoicesByID(prolificId, turnNum);
    allResults = [];
    for(var i = 0; i < prolificIDArray.length; i++){
        let playerProlific = prolificIDArray[i];
        let playerRoundResult = calculateResultOfID( playerProlific, allChoices);
        
        allResults.push(playerRoundResult);
    }
    return allResults;
}

// function isTripleBonus(prolificId, tempPlayer, choices, tempChoices) {
//     if(tempChoices.length != choices.length){
//         return false;
//     }
//     var i = 0;
//     var j = 0;
//     while(i < choices.length && j < choices.length){
//         if(choices[i] === (prolificId) || choices[i] === (tempPlayer)){
//             i++;
//         }
//         if(tempChoices[j] === (prolificId) || tempChoices[j] === (tempPlayer)){
//             j++;
//         }
//         if( choices[i] !== (prolificId) && choices[i] !== (tempPlayer)
//         && tempChoices[j] !== (prolificId) && tempChoices[j] !== (tempPlayer)){
//             if(choices[i] === (tempChoices[j])){
//                 return true;
//             }
//         }

//     }
//     return false;
// }

function calculateResultOfID(playerProlific, allChoices){
    let choicesProlific = allChoices.get(playerProlific);
    let count = 0;
    for(var i = 0; i < choicesProlific.length; i++){
        let playerChosen = choicesProlific[i];
        let choicesChosenPlayer = allChoices.get(playerChosen);
        for (var j = 0; j < choicesChosenPlayer.length; j++) {
            if (choicesChosenPlayer[j] === (playerProlific)) {
                count += 4;
            }
        }
    }
    if(count == 8){
        console.log('TRIPLE BONUS');
        return (count - 1);
    }
    return count;

}

module.exports = {
    getResultsByProlificId : getResultsByProlificId,
}