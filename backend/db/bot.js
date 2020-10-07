const ChoiceModel = require('./models/choice.js').ChoiceModel;
const DB_API = require('../db/db_api.js');


function saveBotChoiceToDB(prolificId, turnNum, isBot){
    let choices = determineBotChoice();
    DB_API.savePlayerChoiceToDB(prolificId, choices, turnNum, isBot);
}

function determineBotChoice(){
    var numberOfChoices = Math.floor((Math.random() * 3) + 1);
    var choiceArray = [numberOfChoices];
    for(var i = 1; i < numberOfChoices; i++ ){
        choiceArray[i] = Math.floor((Math.random() * 6) + 1);
    }
    return choiceArray;

}


module.exports = {
    saveBotChoiceToDB: saveBotChoiceToDB,
}