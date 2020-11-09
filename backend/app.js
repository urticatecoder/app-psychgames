const express = require("express");
const app = express();
const path = require('path');
const lobby = require('./lobby.js').LobbyInstance;
const DB_API = require('./db/db_api');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../frontend/build')));

app.get("/test_api", (req, res) => {
    res.status(200).send("Hello World!");
});

app.get("/login-code", ((req, res) => {
    let prolificID = req.query.loginCode;
    let error = '';
    let isValid = true;
    if (prolificID === undefined || prolificID.trim() === '') {
        isValid = false;
        error = 'ProlificID is empty.';
    } else if (prolificID === 'CS307') { // for testing purpose
        isValid = false;
        error = 'Not a code registered by Prolific.'
    } else if (lobby.playerToRoom.has(prolificID)) {
        isValid = false;
        error = 'Duplicated prolificID found.';
    }
    res.status(200).send({'isValid': isValid, 'error': error});
}));

app.get("/download-game1", async (req, res) => {
    let experiments = await DB_API.getAllChoicesByDateRange();
    let result = []
    experiments.forEach((experiment) => {
        let players = experiment.players;
        players.forEach((player) => {
            // game 1 choices
            player.choice.forEach((choice) => {
                result.push({
                    experimentID: experiment._id,
                    prolificID: player.prolificID,
                    turnNum: choice.turnNum,
                    selectedIDs: choice.selectedPlayerID,
                    madeByBot: choice.madeByBot.toString(),
                });
            });
        });

    });
    res.status(200).json(result);
})

app.get("/download-game2", async (req, res) => {
    let experiments = await DB_API.getAllChoicesByDateRange();
    let result = []
    experiments.forEach((experiment) => {
        let players = experiment.players;
        players.forEach((player) => {
            // game 2 allocations
            player.allocation.forEach((allocation) => {
                result.push({
                    experimentID: experiment._id,
                    prolificID: player.prolificID,
                    turnNum: allocation.turnNum,
                    keepToken: allocation.keepToken,
                    investToken: allocation.investToken,
                    competeToken: allocation.competeToken,
                    investPayoff: allocation.investPayoff,
                    competePayoff: allocation.competePayoff,
                    madeByBot: allocation.madeByBot.toString(),
                });
            });
        });

    });
    res.status(200).json(result);
});

app.get("/auth", (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    res.status(200).send({'isValid': username === 'mel' && password === 'CS408'});
});

app.get("/player-ids", (req, res) => {
    let prolificID = req.query.loginCode;
    let room = lobby.getRoomPlayerIsIn(prolificID);
    if (room === undefined) {
        res.status(200).send({"error": `ProlificID ${prolificID} not found.`});
    } else {
        let ids = lobby.getAllPlayersIDsInRoomWithName(room.name);
        res.status(200).send({"ids": ids});
    }
});

app.get("/game1-results", (req, res) => {
    let prolificID = req.query.loginCode;
    let room = lobby.getRoomPlayerIsIn(prolificID);
    if (room === undefined) {
        res.status(200).send({"error": `ProlificID ${prolificID} not found.`});
    } else {
        let results = room.gameOneResults;
        res.status(200).send({"winners": results[0], "losers": results[1]});
    }
});

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../frontend/build/index.html'));
});

module.exports = app;



