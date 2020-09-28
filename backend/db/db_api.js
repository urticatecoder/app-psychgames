const PlayerModel = require('./models/player.js').PlayerModel;
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

module.exports = {
    saveNewPlayerToDB: saveNewPlayerToDB,
    findPlayerByID: findPlayerByID,
}

