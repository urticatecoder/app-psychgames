const PlayerModel = require('./models/player.js').PlayerModel;
const experimentModel = require('./models/experiment.js');

function saveNewPlayerToDB(prolific_id) {
    let player = new PlayerModel({prolific_id: prolific_id});
    player.save(function (err) {
        if (err) {
            console.log(err);
        }
        // console.log("Successfully saved player to database.");
    });
}

async function findPlayerByID(prolific_id) {
    try {
        return await PlayerModel.findOne({'prolific_id': prolific_id});
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    saveNewPlayerToDB: saveNewPlayerToDB,
    findPlayerByID: findPlayerByID,
}

