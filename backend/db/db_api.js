const PlayerModel = require('./models/player.js').PlayerModel;
const ChoiceModel = require('./models/choice.js').ChoiceModel;
const ExperimentModel = require('./models/experiment.js').ExperimentModel;
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

function saveExperimentSession(playerIDs) {
    let experiment = new ExperimentModel();
    experiment.players = [];
    playerIDs.forEach((id) => {
        experiment.players.push({prolificID: id});
    });
    return experiment.save();
}

function saveChoiceToDB(prolificID, selectedPlayerID, turnNum, madeByBot) {
    ExperimentModel.findOne({"players.prolificID": prolificID}).then((experiment) => {
        experiment.players.forEach((player) => {
            if (player.prolificID === prolificID) {
                player.choice.push({
                    prolificID: prolificID,
                    selectedPlayerID: selectedPlayerID,
                    turnNum: turnNum,
                    madeByBot: madeByBot
                });
            }
        });
        experiment.save();
    });
}

function saveAllocationToDB(prolificID, keepToken, investToken, competeToken, investPayoff, competePayoff, turnNum, madeByBot) {
    ExperimentModel.findOne({"players.prolificID": prolificID}).then((experiment) => {
        experiment.players.forEach((player) => {
            if (player.prolificID === prolificID) {
                player.allocation.push({
                    prolificID: prolificID,
                    keepToken: keepToken,
                    investToken: investToken,
                    competeToken: competeToken,
                    investPayoff: investPayoff,
                    competePayoff: competePayoff,
                    turnNum: turnNum,
                    madeByBot: madeByBot
                });
            }
        });
        experiment.save();
    });
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

async function getAllChoices() {
    try {
        return await ChoiceModel.find().select('-_id -__v');
    } catch (e) {
        console.log(e);
    }
}

async function getAllChoicesByDateRange() {
    try {
        return await ExperimentModel.find({date: {$gte: '2020-11-08', $lte: '2020-11-10'}});
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    saveNewPlayerToDB: saveNewPlayerToDB,
    findPlayerByID: findPlayerByID,
    findChoicesByID: findChoicesByID,
    getAllChoices: getAllChoices,
    saveExperimentSession: saveExperimentSession,
    saveChoiceToDB: saveChoiceToDB,
    saveAllocationToDB: saveAllocationToDB,
    getAllChoicesByDateRange: getAllChoicesByDateRange,
}

