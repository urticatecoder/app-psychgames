let mongoose = require('mongoose');
let Player = require('./player.js');

let ExperimentSchema = new mongoose.Schema({
    players: {type: [Player.PlayerSchema]}, // an array of all the players who participated in this experiment
    date: {type: Date, default: Date.now()}, // the date on which this experiment is administered
});

module.exports = {
    ExperimentSchema: ExperimentSchema,
    ExperimentModel: mongoose.model('Experiment', ExperimentSchema)
};

