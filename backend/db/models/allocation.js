let mongoose = require('mongoose');

let AllocationSchema = new mongoose.Schema(
    {
        _id: false,
        prolificID: {type: String, required: true}, // id of the player who made this choice
        keepToken: {type: Number, required: true},
        investToken: {type: Number, required: true},
        competeToken: {type: Number, required: true},
        investPayoff: {type: Number, required: true},
        competePayoff: {type: Number, required: true},
        turnNum: {type: Number, required: true}, // at which turn was this choice made
        madeByBot: {type: Boolean, default: false} // is this choice made by a bot
    }
);

module.exports = {
    AllocationSchema: AllocationSchema,
    AllocationModel: mongoose.model('Allocation', AllocationSchema)
};
