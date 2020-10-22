const ChoiceModel = require('./models/choice.js').ChoiceModel;
const DB_API = require('../db/db_api.js');


function saveBotChoiceToDB(prolificId, turnNum, isBot) {
    let choices = determineBotChoice();
    return DB_API.savePlayerChoiceToDB(prolificId, choices, turnNum, isBot);
}

function determineBotChoice(selfID, prolificIDs) {
    let numberOfChoices = 2;
    let botChoices = [];
    for (let i = 0; i < numberOfChoices; i++) {
        let randomIndex = Math.floor(Math.random() * prolificIDs.length);
        while (prolificIDs[randomIndex] === selfID || botChoices.includes(prolificIDs[randomIndex])) {
            randomIndex = Math.floor(Math.random() * prolificIDs.length);
        }
        botChoices.push(prolificIDs[randomIndex]);
    }
    return botChoices;
}


module.exports = {
    saveBotChoiceToDB: saveBotChoiceToDB,
    determineBotChoice: determineBotChoice,
}
