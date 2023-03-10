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
function saveExperimentSession(experimentID, playerIDs) {
    let experiment = new ExperimentModel();
    experiment._id = experimentID;
    experiment.players = [];
    playerIDs.forEach((id) => {
        experiment.players.push({ prolificID: id });
    });
    console.log("New experiment " + experiment._id);
    return experiment.save();
}

/**
 * @param prolificID {string}
 * @param selectedPlayerIDs {string[]}
 * @param turnNum {number}
 * @param madeByBot {boolean} is this choice made by a bot
 * @return {Promise|PromiseLike<*>|Promise<*>}
 */
function saveChoiceToDB(experimentID, prolificID, selectedPlayerIDs, turnNum, madeByBot, oldLocation, newLocation, singleChoiceCount, doubleBonusCount, tripleBonusCount) {
    // console.log("Saving user choices for experiment " + experimentID);
    return ExperimentModel.findById(experimentID).then((experiment) => {
        experiment.players.forEach((player) => {
            if (player.prolificID === prolificID) {
                player.choice.push({
                    prolificID: prolificID,
                    selectedPlayerID: selectedPlayerIDs,
                    turnNum: turnNum,
                    madeByBot: madeByBot,
                    oldLocation: oldLocation,
                    newLocation: newLocation,
                    singleChoiceCount: singleChoiceCount,
                    doubleBonusCount: doubleBonusCount,
                    tripleBonusCount: tripleBonusCount,
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
function saveAllocationToDB(experimentID, prolificID, keepToken, investToken, competeToken, investPayoff, competePayoff, turnNum, madeByBot) {
    // console.log("Saving user allocation for experiment " + experimentID);
    return ExperimentModel.findById(experimentID).then((experiment) => {
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
 * Save the randomly selected Gamd 2 turn number for calculating the player's final payout
 * @param {*} experimentID 
 * @param {string} prolificID 
 * @param {integer} turnNum 
 * @returns 
 */
function savePlayerRecieptTurnNum(experimentID, prolificID, turnNum) {
    return ExperimentModel.findById(experimentID).then((experiment) => {
        experiment.players.forEach((player) => {
            if (player.prolificID === prolificID) {
                player.receiptTurnNum = turnNum;
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
        let endDateAdjusted = new Date(endDate);
        endDateAdjusted.setDate(endDateAdjusted.getDate() + 1);
        console.log("Retrieving data in date range: " + startDate, endDateAdjusted);
        return await ExperimentModel.find({ date: { $gte: startDate, $lt: endDateAdjusted } }).sort({ date: -1 });

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
        return await ExperimentModel.find().sort({ date: 1 })[0];
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    saveExperimentSession: saveExperimentSession,
    saveChoiceToDB: saveChoiceToDB,
    saveAllocationToDB: saveAllocationToDB,
    savePlayerRecieptTurnNum: savePlayerRecieptTurnNum,
    getAllDataByDateRange: getAllDataByDateRange,
    getOldestEntry: getOldestEntry,
}

