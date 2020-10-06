const PlayerModel = require('./models/player.js').PlayerModel;
const ChoiceModel = require('./models/choice.js').ChoiceModel;
const experimentModel = require('./models/experiment.js');

function saveNewPlayerToDB(prolificID) {
    let player = new PlayerModel({prolificID: prolificID});
    player.save(function (err) {
        if (err) {
            console.log(err);
        }
        // console.log("Successfully saved player to database.");
    });
}

async function findPlayerByID(prolificID) {
    try {
        return await PlayerModel.findOne({'prolificID': prolificID});
    } catch (e) {
        console.log(e);
    }
}


function savePlayerChoiceToDB(prolificID, selectedPlayerID, turnNum, madeByBot) {
    let choice = new ChoiceModel({prolificID: prolificID, selectedPlayerID: selectedPlayerID,
        turnNum: turnNum, madeByBot: madeByBot});
    
    choice.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    saveNewPlayerToDB: saveNewPlayerToDB,
    findPlayerByID: findPlayerByID,
    savePlayerChoiceToDB: savePlayerChoiceToDB,
}

