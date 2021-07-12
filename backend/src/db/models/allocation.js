/**
 * @author Xi Pu
 * A schema for storing data related to a specific allocation made by a player in game 2.
 * The schema is defined below.
 * See comments for a description of what each field represents.
 */

let mongoose = require('mongoose');

let AllocationSchema = new mongoose.Schema(
    {
        _id: false, // this is for making sure mongoDB will not automatically add this field
        prolificID: {type: String, required: true}, // id of the player who made this choice
        keepToken: {type: Number, required: true},
        investToken: {type: Number, required: true},
        competeToken: {type: Number, required: true},
        investPayoff: {type: Number, required: true},
        competePayoff: {type: Number, required: true},
        turnNum: {type: Number, required: true}, // at which turn was this allocation made in game 2
        madeByBot: {type: Boolean, default: false} // is this allocation made by a bot
    }
);

module.exports = {
    AllocationSchema: AllocationSchema,
    AllocationModel: mongoose.model('Allocation', AllocationSchema)
};
