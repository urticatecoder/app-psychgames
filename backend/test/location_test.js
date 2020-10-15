const assert = require('assert');
const BOT = require('../db/bot.js');
const mongoose = require('mongoose');
const { saveNewPlayerToDB } = require('../db/db_api.js');
const Room = require('../lobby.js').Room;
const Player = require('../lobby.js').Player;
const { getResultsByProlificId, isTripleBonus } = require('../db/results.js');
const DB_API = require('../db/db_api.js');


describe('Test location calculation', () => {
    before(function (done) {
        mongoose.connect('mongodb+srv://xipu:k5q1J0qhOrVb1F65@cluster0.jcnnf.azure.mongodb.net/psych_game_test?retryWrites=true&w=majority&socketTimeoutMS=360000&connectTimeoutMS=360000', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function () {
            console.log("Connected to test db successfully.");
            done();
        });
        db.once('disconnected', () => {
            console.log('DB connection closed');
        });
    });

    it('calculates results and location correctly', (done) => {
        const testID = 'test_id1';
        saveNewPlayerToDB(testID);
        var choices = ['test_id', 'test_id1'];
        var choices_other = ['test_id1'];
        const num = 3;
        const bot = false;
        // why are there errors
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id'));
        room.addPlayer(new Player('test_id1'));
        room.getPlayerWithID('test_id').recordChoices(choices_other);
        room.getPlayerWithID(testID).recordChoices(choices);

        // console.log(room);
        DB_API.savePlayerChoiceToDB(testID, choices, num, bot).then(() => {
            const count = getResultsByProlificId(testID, num, room);
            // console.log(count);
            assert(count === 50);
            done();
        }).catch((err) => {
            done(err);
        });
    });
    it('ensuring the triple algorithm method works for true', (done) => {
        const testID = 'test_id1';
        saveNewPlayerToDB(testID);
        var choices = ['test_id', 'test_id1'];
        const num = 3;
        const bot = false;
        // why are there errors
        let check = isTripleBonus('test1', 'test2', ['test1', 'test2', 'test3'], ['test1', 'test2', 'test3']);
        assert(check === true);
        done();
    });

    it('calculates results and location correctly', (done) => {
        const testID = 'test_id1';
        var choices = ['test_id', 'test_id1', 'test_id2'];
        var choices_other = ['test_id1', 'test_id', 'test_id2'];
        var other_choices = ['test_id2', 'test_id1', 'test_id'];
        const num = 3;
        const bot = false;
        // why are there errors
        const room = new Room('room 0');
        room.addPlayer(new Player('test_id'));
        room.addPlayer(new Player('test_id1'));
        room.addPlayer(new Player('test_id2'));
        room.getPlayerWithID('test_id').recordChoices(choices_other);
        room.getPlayerWithID(testID).recordChoices(choices);
        room.getPlayerWithID('test_id2').recordChoices(other_choices);

        DB_API.savePlayerChoiceToDB(testID, choices, num, bot).then(() => {
            const count = getResultsByProlificId(testID, num, room);
            // console.log(count);
            assert(count === 80 );
            done();
        }).catch((err) => {
            done(err);
        });
    });

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });


})
