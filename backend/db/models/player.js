let mongoose = require('mongoose');
let Choice = require('./choice');
let Allocation = require('./allocation');

let PlayerSchema = new mongoose.Schema(
    {
        _id: false,
        prolificID: {type: String, required: true},
        choice: {type: [Choice.ChoiceSchema], default: []},
        allocation: {type: [Allocation.AllocationSchema], default: []},
        payment: {type: Number, default: 0}, // this player's final payment in cents
    }
);

/* schema -> model -> document
compile the above schema definition into a model and export it so we can use it elsewhere */
module.exports = {
    PlayerSchema: PlayerSchema,
    PlayerModel: mongoose.model('Player', PlayerSchema)
};
