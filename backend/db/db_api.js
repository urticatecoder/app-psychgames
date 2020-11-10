const PlayerModel = require('./models/player.js').PlayerModel;
const ChoiceModel = require('./models/choice.js').ChoiceModel;
const ExperimentModel = require('./models/experiment.js').ExperimentModel;

function saveExperimentSession(playerIDs) {
    let experiment = new ExperimentModel();
    experiment.players = [];
    playerIDs.forEach((id) => {
        experiment.players.push({prolificID: id});
    });
    return experiment.save();
}

function saveChoiceToDB(prolificID, selectedPlayerID, turnNum, madeByBot) {
    return ExperimentModel.findOne({"players.prolificID": prolificID}).then((experiment) => {
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
        return experiment.save();
    });
}

function saveAllocationToDB(prolificID, keepToken, investToken, competeToken, investPayoff, competePayoff, turnNum, madeByBot) {
    return ExperimentModel.findOne({"players.prolificID": prolificID}).then((experiment) => {
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
        return experiment.save();
    });
}

/* in the format of 2020-11-10 */
async function getAllChoicesByDateRange(startDate, endDate) {
    try {
        return await ExperimentModel.find({date: {$gte: startDate, $lte: endDate}});
    } catch (e) {
        console.log(e);
    }
}

/**
 * @deprecated Will be deleted in the final version
 */
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

/**
 * @deprecated Will be deleted in the final version
 */
async function findPlayerByID(prolificID) {
    try {
        return await PlayerModel.findOne({'prolificID': prolificID}).exec();
    } catch (e) {
        console.log(e);
    }
}

/**
 * @deprecated Will be deleted in the final version
 */
async function findChoicesByID(prolificID, turnNum) {
    try {
        return await ChoiceModel.findOne({'prolificID': prolificID, 'turnNum': turnNum}).exec();
    } catch (e) {
        console.log(e);
    }
}

/**
 * @deprecated Will be deleted in the final version
 */
async function getAllChoices() {
    try {
        return await ChoiceModel.find().select('-_id -__v');
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    saveExperimentSession: saveExperimentSession,
    saveChoiceToDB: saveChoiceToDB,
    saveAllocationToDB: saveAllocationToDB,
    getAllChoicesByDateRange: getAllChoicesByDateRange,
}

