/**
 * @author Xi Pu
 * A schema for storing all information about a specific game/experiment session.
 * The schema is defined below. Note that the field players is defined as an array of PlayerSchema,
 * which is defined in player.js in the same folder as this file.
 * See comments for a description of what each field represents.
 */

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

