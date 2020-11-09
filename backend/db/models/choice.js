let mongoose = require('mongoose');

let ChoiceSchema = new mongoose.Schema(
    {
        _id: false,
        prolificID: {type: String, required: true}, // id of the player who made this choice
        selectedPlayerID: {type: [String], required: true}, // id of the player who was selected
        turnNum: {type: Number, required: true}, // at which turn was this choice made
        madeByBot: {type: Boolean, default: false} // is this choice made by a bot
    }
);

module.exports = {
    ChoiceSchema: ChoiceSchema,
    ChoiceModel: mongoose.model('Choice', ChoiceSchema)
};
