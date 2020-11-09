const expect = require('chai').expect;
const DB_API = require('../db/db_api.js');
const mongoose = require('mongoose');
const {ExperimentModel} = require("../db/models/experiment");

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
        db.once('disconnected', () => {
            console.log('DB connection closed');
        });
    });
    it('save experiment schema', (done) => {
        const testIDs = ['123', '234', '345'];
        DB_API.saveExperimentSession(testIDs).then((experiment) => {
            let experimentID = experiment._id;
            return ExperimentModel.findOne({_id: experimentID}).then((result) => {
                expect(experiment.toString()).to.equal(result.toString());
                done();
            });
        }).catch(err => done(err));
    });
    it('save choice schema', (done) => {
        DB_API.saveExperimentSession(['111', '222', '333']).then(() => {
            return DB_API.saveChoiceToDB('111', ['222', '333'], 1, false).then((result) => {
                let savedChoice = result.players[0].choice[0];
                expect(savedChoice.selectedPlayerID).to.deep.equal(['222', '333']);
                expect(savedChoice.turnNum).to.equal(1);
                expect(savedChoice.madeByBot).to.equal(false);
                done();
            });
        }).catch(err => done(err));
    });
    it('save allocation schema', (done) => {
        DB_API.saveExperimentSession(['aaa', 'bbb', 'ccc']).then(() => {
            return DB_API.saveAllocationToDB('aaa', 3, 4, 3, 0.5, 1, 1, false).then((result) => {
                let savedAllocation = result.players[0].allocation[0];
                expect(savedAllocation.keepToken).to.equal(3);
                expect(savedAllocation.investPayoff).to.equal(0.5);
                done();
            });
        }).catch(err => done(err));
    });
    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});
