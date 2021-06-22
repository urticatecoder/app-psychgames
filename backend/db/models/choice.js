/**
 * @author Xi Pu, Nick DeCapite
 * A schema for storing data related to a specific choice made by a player in game 1.
 * The schema is defined below.
 * See comments for a description of what each field represents.
 */

let mongoose = require('mongoose');
const DEFAULT_PLAYER_LOCATION = require("../../games_config.js").DEFAULT_PLAYER_LOCATION;;


let ChoiceSchema = new mongoose.Schema(
    {
        _id: false, // this is for making sure mongoDB will not automatically add this field
        prolificID: { type: String, required: true }, // id of the player who made this choice
        selectedPlayerID: { type: [String], required: true }, // ids of players who were selected
        turnNum: { type: Number, required: true }, // at which turn was this choice made in game 1
        madeByBot: { type: Boolean, default: false }, // is this choice made by a bot
        oldLocation: { type: Number, default: DEFAULT_PLAYER_LOCATION }, // original location before the choice was made
        newLocation: { type: Number, default: DEFAULT_PLAYER_LOCATION }, // resulting location after the choice
        singleChoiceCount: { type: Number, default: 0 }, // number of times this player is chosen by the other players in the current turn
        doubleBonusCount: { type: Number, default: 0 }, // number of double bonuses involving this player in the current turn
        tripleBonusCount: { type: Number, default: 0 }, // number of triple bonuses involving this player in the current turn
    }
);

module.exports = {
    ChoiceSchema: ChoiceSchema,
    ChoiceModel: mongoose.model('Choice', ChoiceSchema)
};
