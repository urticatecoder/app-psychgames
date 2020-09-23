const playerModel = require('models/player.js').PlayerModel;
const experimentModel = require('models/experiment.js');

function test() {
    let player = new playerModel({});
    player.save(function (err) {
        if(err){
            console.log(err);
            return;
        }
        console.log("Successfully saved player to database.");
    });
}

