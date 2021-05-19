/**
 * @author Xi Pu, Nick DeCapite
 * This module contains helper methods to save into or read from a MongoDB database by using Mongoose.
 */

const PlayerModel = require('./models/player.js').PlayerModel;
const ChoiceModel = require('./models/choice.js').ChoiceModel;
const ExperimentModel = require('./models/experiment.js').ExperimentModel;

/**
 * @param playerIDs {string[]}
 * @return {Promise<*>}
 */
function saveExperimentSession(playerIDs) {
    let experiment = new ExperimentModel();
    experiment.players = [];
    playerIDs.forEach((id) => {
        experiment.players.push({ prolificID: id });
    });
    experiment.save();
    return experiment._id;
}

/**
 * @param prolificID {string}
 * @param selectedPlayerIDs {string[]}
 * @param turnNum {number}
 * @param madeByBot {boolean} is this choice made by a bot
 * @return {Promise|PromiseLike<*>|Promise<*>}
 */
function saveChoiceToDB(prolificID, selectedPlayerIDs, turnNum, madeByBot) {
    return ExperimentModel.findOne({ "players.prolificID": prolificID }).then((experiment) => {
        experiment.players.forEach((player) => {
            if (player.prolificID === prolificID) {
                player.choice.push({
                    prolificID: prolificID,
                    selectedPlayerID: selectedPlayerIDs,
                    turnNum: turnNum,
                    madeByBot: madeByBot
                });
            }
        });
        return experiment.save();
    });
}

/**
 * @param prolificID {string}
 * @param keepToken {number}
 * @param investToken {number}
 * @param competeToken {number}
 * @param investPayoff {number}
 * @param competePayoff {number}
 * @param turnNum {number}
 * @param madeByBot {boolean} is this allocation made by a bot
 * @return {Promise|PromiseLike<*>|Promise<*>}
 */
function saveAllocationToDB(prolificID, keepToken, investToken, competeToken, investPayoff, competePayoff, turnNum, madeByBot) {
    return ExperimentModel.findOne({ "players.prolificID": prolificID }).then((experiment) => {
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

/**
 * @param startDate {string} in the format of YYYY-MM-DD, e.g. "2020-11-10"
 * @param endDate {string} in the format of YYYY-MM-DD, e.g. "2020-11-11"
 * @return {Promise<*>}
 */
async function getAllDataByDateRange(startDate, endDate) {
    try {
        return await ExperimentModel.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 });
    } catch (e) {
        console.log(e);
    }
}

async function getLatestEntry() {
    try {
        return await ExperimentModel.find().sort({ date: -1 })[0];
    } catch (e) {
        console.log(e);
    }
}

async function getOldestEntry() {
    try {
        return await ExperimentModel.findOne().sort({ date: 1 })[0];
    } catch (e) {
        console.log(e);
    }
}

/**
 * @deprecated Will be deleted in the final version
 */
function saveNewPlayerToDB(prolificID) {
    let player = new PlayerModel({ prolificID: prolificID });
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
        return await PlayerModel.findOne({ 'prolificID': prolificID }).exec();
    } catch (e) {
        console.log(e);
    }
}

/**
 * @deprecated Will be deleted in the final version
 */
async function findChoicesByID(prolificID, turnNum) {
    try {
        return await ChoiceModel.findOne({ 'prolificID': prolificID, 'turnNum': turnNum }).exec();
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
    getAllDataByDateRange: getAllDataByDateRange,
    getOldestEntry: getOldestEntry,
}

