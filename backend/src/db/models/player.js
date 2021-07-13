/**
 * @author Xi Pu
 * A schema for storing information about an individual player who participated in the experiment.
 * The schema is defined below. Note that the field choice and allocation are defined as two arrays of ChoiceSchema and AllocationSchema respectively,
 * which are defined in choice.js and allocation.js in the same folder as this file.
 * See comments for a description of what each field represents.
 */

let mongoose = require('mongoose');
let Choice = require('./choice');
let Allocation = require('./allocation');

let PlayerSchema = new mongoose.Schema(
    {
        _id: false, // this is for making sure mongoDB will not automatically add this field
        prolificID: { type: String, required: true }, // the id of this player
        choice: { type: [Choice.ChoiceSchema], default: [] }, // all the choices this player made in game 1
        allocation: { type: [Allocation.AllocationSchema], default: [] }, // all the allocation this player made in game 2
        receiptTurnNum: { type: Number, default: -1 }, // the selected Game 2 turn number for calculating the final payout
        payment: { type: Number, default: 0 }, // this player's final payment in cents
    }
);

/* schema -> model -> document
compile the above schema definition into a model and export it so we can use it elsewhere */
module.exports = {
    PlayerSchema: PlayerSchema,
    PlayerModel: mongoose.model('Player', PlayerSchema)
};
