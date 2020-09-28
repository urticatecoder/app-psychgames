let mongoose = require('mongoose');

let ChoiceSchema = new mongoose.Schema(
    {
        prolific_id: {type: String, required: true}, // id of the player who made this choice
        selected_player_id: {type: String, required: true}, // id of the player who was selected
        turn_num: {type: Number, required: true}, // at which turn was this choice made
        made_by_bot: {type: Boolean, default: false} // is this choice made by a bot
    }
);

module.exports = {
    ChoiceSchema: ChoiceSchema,
    ChoiceModel: mongoose.model('Choice', ChoiceSchema)
};
