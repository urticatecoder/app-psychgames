const supertest = require('supertest');
const app = require('../src/app.js');
const lobby = require('../src/lobby/lobby').LobbyInstance;

describe("API route test", function () {
    it("GET / should has status code 200", function (done) {
        supertest(app)
            .get("/")
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
    it("GET /login-code gives the correct response when login code is valid", function (done) {
        supertest(app)
            .get("/login-code?loginCode=CS408")
            .expect({ isValid: true, error: '' })
            .end(function (err, res) {
                if (err) throw err;
                done();
            });
    });
    it("GET /login-code gives the correct response when login code is empty", function (done) {
        supertest(app)
            .get("/login-code?loginCode=")
            .expect({ isValid: false, error: 'ProlificID is empty.' })
            .end(function (err, res) {
                if (err) throw err;
            });

        supertest(app)
            .get("/login-code?")
            .expect({ isValid: false, error: 'ProlificID is empty.' })
            .end(function (err, res) {
                if (err) throw err;
                done();
            });
    });

    it("GET /player-ids", function (done) {
        // console.log(lobby);
        lobby.findRoomForPlayerToJoin('123');
        lobby.findRoomForPlayerToJoin('234');
        lobby.findRoomForPlayerToJoin('456');
        supertest(app)
            .get("/player-ids?loginCode=123")
            .expect({ 'ids': ['123', '234', '456'] })
            .end(function (err, res) {
                if (err) done(err);
            });

        supertest(app)
            .get("/player-ids?loginCode=CS408")
            .expect({ 'error': 'ProlificID CS408 not found.' })
            .end(function (err, res) {
                if (err) done(err);
            });

        done();
    });

    it("GET /game1-results", function (done) {
        let room = lobby.getRoomOfPlayer('123');
        let winners = ['123', '456', '789'];
        let losers = ['abc', 'def', 'zzz'];
        room.setGameOneResults(winners, losers);

        supertest(app)
            .get("/game1-results?loginCode=123")
            .expect({ 'winners': ['123', '456', '789'], 'losers': ['abc', 'def', 'zzz'] })
            .end(function (err, res) {
                if (err) done(err);
            });

        supertest(app)
            .get("/game1-results?loginCode=CS408")
            .expect({ 'error': 'ProlificID CS408 not found.' })
            .end(function (err, res) {
                if (err) done(err);
            });

        done();
    });

    it("GET /verification-code", function (done) {
        supertest(app)
            .get("/verification-code?loginCode=CS307")
            .expect({ 'code': 'INVALID_CODE' })
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });

    after(function (done) {
        lobby.reset();
        done();
    });
});
