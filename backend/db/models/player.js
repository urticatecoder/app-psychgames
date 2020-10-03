let mongoose = require('mongoose');

let PlayerSchema = new mongoose.Schema(
    {
        prolificID: {type: String, required: true},
        game: {type: [String], default: [null]},
        choice: {type: [String], default: [null]}, // TODO: still need to figure out what's the best way to store a player's choice at each turn
        payment: {type: Number, default: 0}, // this player's final payment in cents
    }
);

/* schema -> model -> document
compile the above schema definition into a model and export it so we can use it elsewhere */
module.exports = {
    PlayerSchema: PlayerSchema,
    PlayerModel: mongoose.model('Player', PlayerSchema)
};
