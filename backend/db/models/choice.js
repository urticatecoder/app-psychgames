/**
 * @author Xi Pu
 * A schema for storing data related to a specific choice made by a player in game 1.
 * The schema is defined below.
 * See comments for a description of what each field represents.
 */

let mongoose = require('mongoose');

let ChoiceSchema = new mongoose.Schema(
    {
        _id: false, // this is for making sure mongoDB will not automatically add this field
        prolificID: {type: String, required: true}, // id of the player who made this choice
        selectedPlayerID: {type: [String], required: true}, // ids of players who were selected
        turnNum: {type: Number, required: true}, // at which turn was this choice made in game 1
        madeByBot: {type: Boolean, default: false} // is this choice made by a bot
    }
);

module.exports = {
    ChoiceSchema: ChoiceSchema,
    ChoiceModel: mongoose.model('Choice', ChoiceSchema)
};
