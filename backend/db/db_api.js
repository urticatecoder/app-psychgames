const PlayerModel = require('./models/player.js').PlayerModel;
const ChoiceModel = require('./models/choice.js').ChoiceModel;
const experimentModel = require('./models/experiment.js');
const lobby = require('../lobby.js').LobbyInstance;

function saveNewPlayerToDB(prolificID) {
    let player = new PlayerModel({prolificID: prolificID});
    return player.save();
    // player.save(function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     // console.log("Successfully saved player to database.");
    // });
}

async function findPlayerByID(prolificID) {
    try {
        return await PlayerModel.findOne({'prolificID': prolificID}).exec();
    } catch (e) {
        console.log(e);
    }
}

async function findChoicesByID(prolificID, turnNum) {
    try {
        return await ChoiceModel.findOne({'prolificID': prolificID, 'turnNum': turnNum}).exec();
    } catch (e) {
        console.log(e);
    }
}

function savePlayerChoiceToDB(prolificID, selectedPlayerID, turnNum, madeByBot) {
    let choice = new ChoiceModel({
        prolificID: prolificID, selectedPlayerID: selectedPlayerID,
        turnNum: turnNum, madeByBot: madeByBot
    });

    return choice.save();
}

module.exports = {
    saveNewPlayerToDB: saveNewPlayerToDB,
    findPlayerByID: findPlayerByID,
    findChoicesByID: findChoicesByID,
    savePlayerChoiceToDB: savePlayerChoiceToDB,
}

