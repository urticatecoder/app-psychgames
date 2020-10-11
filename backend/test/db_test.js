const assert = require('assert');
const DB_API = require('../db/db_api.js');
const BOT = require('../db/bot.js');
const mongoose = require('mongoose');
const { saveNewPlayerToDB } = require('../db/db_api.js');
const { getResultsByProlificId, isTripleBonus } = require('../db/results.js');
require('../db/results');
describe('Test database query API', () => {
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
        db.on('disconnected', () => {
            console.log('DB connection closed');
        });
    });
    it('finds the player with the correct prolific ID', (done) => {
        const testID = 'test_id';
        DB_API.saveNewPlayerToDB(testID).then(() => {
            DB_API.findPlayerByID(testID).then(function (result) {
                assert(result.prolificID === testID);
            }).catch(function (err) {
                console.log(err);
            });
            done();
        });
    });
    it('saves the player choice into database', (done) => {
        const testID = 'test_id';
        var choices = ['player1', 'player2', 'player3'];
        const num = 1;
        const bot = false;
        DB_API.savePlayerChoiceToDB(testID, choices, num, bot).then(() => {
            DB_API.findChoicesByID(testID, num).then(function (result) {
                assert(JSON.stringify(result.selectedPlayerID) === JSON.stringify(choices));
            }).catch(function (err) {
                console.log('Error from inside');
                console.log(err);
            });
            done();
        }).catch((err) => {
            console.log('Error from outside');
            console.log(err);
        });
    });
    it('saves the player choice into database for new round', (done) => {
        const testID = 'test_id';
        var choices = ['player4', 'player5', 'player9'];
        const num = 3;
        const bot = false;
        DB_API.savePlayerChoiceToDB(testID, choices, num, bot).then(() => {
            DB_API.findChoicesByID(testID, num).then(function (result) {
                // console.log(result);
                // console.log(result.selectedPlayerID);
                assert(JSON.stringify(result.selectedPlayerID) === JSON.stringify(choices));
                done();
            });
        }).catch((err) => {
            done(err);
        });
    });
    it('saves the player choice by Bot', (done) => {
        const testID = 'test_id';
        const num = 8;
        const bot = true;
        BOT.saveBotChoiceToDB(testID, num, bot).then(async (res) => {
            // console.log(res)
            await DB_API.findChoicesByID(testID, num).then(function (result) {
                // console.log(result);
                // console.log(result.selectedPlayerID);
                assert(result.selectedPlayerID.length <= 3);
            }).catch(function (err) {
                console.log('Error from inside');
                console.log(err);
            });
            done();
        }).catch((err) => {
            console.log('Error from outside');
            console.log(err);
        });
    });
    it('calculates results and location correctly', (done) => {
        const testID = 'test_id1';
        saveNewPlayerToDB(testID);
        var choices = ['test_id', 'test_id1'];
        const num = 3;
        const bot = false;
        // why are there errors
        DB_API.savePlayerChoiceToDB(testID, choices, num, bot).then(() => {
            const count = getResultsByProlificId(testID, num)
            console.log(count);
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
    // it('ensuring the triple algorithm method says false', (done) => {
    //     const testID = 'test_id1';
    //     saveNewPlayerToDB(testID);
    //     var choices = ['test_id', 'test_id1'];
    //     const num = 3;
    //     const bot = false;
    //     // why are there errors
    //     let check = isTripleBonus('test1', 'test2', ['test1', 'test4', 'test3'], ['test1', 'test2', 'test3']);
    //     assert(check === false);
    //     done();
    // });
    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});
