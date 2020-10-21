const DB_API = require('../db/db_api.js');
const choice = require('./models/choice.js');
const lobby = require('../lobby.js').LobbyInstance;

function getResultsByProlificId(prolificIDArray,room) {

    let allChoices = room.getEveryoneChoiceAtCurrentTurn();
    // let allChoices = DB_API.findChoicesByID(prolificId, turnNum);
    allResults = [];
    for(var i = 0; i < prolificIDArray.length; i++){
        let playerProlific = prolificIDArray[i];
        let playerResult = calculateResultOfID(allChoices.get(playerProlific));
        allResults.push(playerResult);
    }
    return allResults;
}

function isTripleBonus(prolificId, tempPlayer, choices, tempChoices) {
    if(tempChoices.length != choices.length){
        return false;
    }
    var i = 0;
    var j = 0;
    while(i < choices.length && j < choices.length){
        if(choices[i] === (prolificId) || choices[i] === (tempPlayer)){
            i++;
        }
        if(tempChoices[j] === (prolificId) || tempChoices[j] === (tempPlayer)){
            j++;
        }
        if( choices[i] !== (prolificId) && choices[i] !== (tempPlayer)
        && tempChoices[j] !== (prolificId) && tempChoices[j] !== (tempPlayer)){
            if(choices[i] === (tempChoices[j])){
                return true;
            }
        }

    }
    return false;
}

function calculateResultOfID(prolificId){
    let choices_of_id = allChoices.get(prolificId);
    let count = 0;
    for(var i = 0; i < choices_of_id.length; i++){
        if(choices_of_id[i] === (prolificId)){ 
            count += 1;
        }
        else{
            let tempPlayer = choices_of_id[i];
            let tempChoices = allChoices.get(tempPlayer);
            for(var j = 0; j < tempChoices.length; j++){
                if(tempChoices[j] === (prolificId)){
                    count +=4;
                    //check if triple bonus
                    // if(count == 5){
                    //     if(isTripleBonus(prolificId, tempPlayer, choices_of_id, tempChoices)){
                    //         return 80;
                    //     }
                    // }
                }
            }
        }  
    }
    // IF COUNT > 9, THERE IS AN ERROR
    if(count == 9){
        console.log('TRIPLE BONUS');
        return (count - 1)*10;
    }
    return count * 10;

}

module.exports = {
    getResultsByProlificId : getResultsByProlificId,
    isTripleBonus : isTripleBonus,
}