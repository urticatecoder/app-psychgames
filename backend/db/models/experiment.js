let mongoose = require('mongoose');
let Player = require('./player.js');

let ExperimentSchema = new mongoose.Schema({
    players: {type: [Player.PlayerSchema]}, // an array of all the players who participated in this experiment
    date: {type: Date}, // the date on which this experiment is administered
});

module.exports = mongoose.model('Experiment', ExperimentSchema);

