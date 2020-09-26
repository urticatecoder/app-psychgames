const assert = require('assert');
const DB_API = require('../db/db_api.js');
const mongoose = require('mongoose')
describe('Test database query API', () => {
    before(function (done) {
        mongoose.connect('mongodb+srv://xipu:k5q1J0qhOrVb1F65@cluster0.jcnnf.azure.mongodb.net/psych_game_test?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function() {
            console.log("Connected to test db successfully.");
            done();
        });
    });
    it('finds the player with the correct prolific ID', (done) => {
        const test_id = 'test_id';
        DB_API.saveNewPlayerToDB(test_id);
        DB_API.findPlayerByID(test_id).then(function(result) {
            assert(result.prolific_id===test_id);
        }).catch(function(err){
            console.log(err);
        });
        done();
    });
    after(function(done){
        mongoose.connection.db.dropDatabase(function(){
            mongoose.connection.close(done);
        });
    });
})
