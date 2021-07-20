const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const DB_API = require('./db/db_api');
const BOT = require("./lobby/bot");
const GameOne = require("./game_one/game_one");
const GameTwo = require('./game_two/game_two');
const lobby = require("./lobby/lobby.js").LobbyInstance;
const FrontendEventMessage = require("./frontend_event_message.js").FrontendEventMessage;
const BackendEventMessage = require("./backend_event_message.js").BackendEventMessage;
const GamesConfig = require('./games_config.js');


// Set up mongoose connection
let mongoose = require('mongoose');

/* use the test database if no environment variables named MONGODB_URI are passed in */
let mongoDB_URI = process.env.MONGODB_URI || 'mongodb+srv://xipu:k5q1J0qhOrVb1F65@cluster0.jcnnf.azure.mongodb.net/psych_game?retryWrites=true&w=majority'
console.log('Connecting to mongoDB_URI: ' + mongoDB_URI);
mongoose.connect(mongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log("Connected to db successfully.");
});


io.on(FrontendEventMessage.CONNECTION, socket => {
    console.log('New client connected');
    //          for Bots 
    // if (process.env.START_MODE === 'bots_auto_join') {
    //     require('./lobby/lobby.js').LobbyBotSocketListener(io, socket);
    // } else {
    //     require('./lobby/lobby.js').LobbyDefaultSocketListener(io, socket);
    // }
    require('./lobby/lobby.js').LobbyDefaultSocketListener(io, socket);

    socket.on(FrontendEventMessage.TIME_IN_LOBBY, (experimentID) => {
        // Sanity check
        if (experimentID == -1) {
            return;
        }
        let room = lobby.getRoomByRoomName(experimentID);
        if (room != null) {
            let time = room.getTime();
            console.log(experimentID + ' time is' + time);
            io.in(room.name).emit(BackendEventMessage.PLAYER_TIME, time);
        }
    });

    socket.on(FrontendEventMessage.ACTIVE_PLAYER, (experimentID, prolificID) => {
        // Sanity check
        if (experimentID == -1) {
            return;
        }
        prolificID = prolificID.toString();
        player = lobby.getPlayerByProlificID(prolificID);
        player.setIsBot(false);
        console.log(playerProlific + ' in room ' + experimentID + ' is active');
    });

    socket.on(FrontendEventMessage.INACTIVE_PLAYER, (experimentID, prolificID) => {
        // Sanity check
        if (experimentID == -1) {
            return;
        }
        // make this player a bot
        prolificID = prolificID.toString();
        player = lobby.getPlayerByProlificID(prolificID);
        player.setIsBot(true);
        console.log(playerProlific + ' in room ' + experimentID + ' is inactive');
    });

    socket.on(FrontendEventMessage.CONFIRM_GAME_ONE, (experimentID, prolificID, choices, remainingTime) => {
        // Sanity check
        if (experimentID == -1) {
            return;
        }
        /* Expected data:
        prolific = player's prolific id
        choices = [player1chosen, player2chosen]
        minimum chosen players = 1
        */
        prolificID = prolificID.toString();
        console.log(prolificID);
        console.log(choices);
        GameOne.recordPlayerChoices(prolificID, choices);

        // if everyone has confirmed or timer has reached 0
        const computeBonus = lobby.areCoPlayersReady(prolificID) || remainingTime <= 0;
        if (computeBonus) { // all human players have confirmed choices
            // Check player passivity
            const room = lobby.getRoomByRoomName(experimentID);
            const roomName = room.roomName;
            const players = room.players;
            players.forEach((currPlayer) => {
                console.log("Checking player " + currPlayer.prolificID);
                if (!currPlayer.isBot && !lobby.hasPlayerConfirmedChoices(currPlayer.prolificID)) {
                    console.log("Choice not yet confirmed");
                    io.in(roomName).emit(BackendEventMessage.CHECK_PASSIVITY, currPlayer.prolificID);
                    currPlayer.setIsBot(true);
                } else {
                    console.log("Choice confirmed");
                }
            });

            // Generate bot choices
            console.log("Generating bot choices");
            const allIDs = players.map(player => player.prolificID);
            players.forEach((currPlayer) => {
                if (currPlayer.isBot) {
                    console.log("Bot choice for " + currPlayer.prolificID);
                    const botChoices = BOT.generateBotChoices(currPlayer.prolificID, allIDs);
                    currPlayer.recordChoices(botChoices);
                }
            });

            // Compute bonuses for all players
            console.log("Computing bonuses");
            const turnResults = GameOne.computeResults(roomName);
            const turnNum = lobby.getRoomTurnNum(roomName);
            allIDs.forEach((currPlayerID) => {
                let currPlayer = room.getPlayerWithID(currPlayerID);
                DB_API.saveChoiceToDB(experimentID, currPlayerID, currPlayer.getChoiceAtTurn(turnNum),
                    turnNum, currPlayer.isBot, currPlayer.oldLocation, currPlayer.newLocation,
                    turnResults.singleChoiceCounts.get(currPlayerID), turnResults.doubleBonusCounts.get(currPlayerID), turnResults.tripleBonusCounts.get(currPlayerID));
            });
            console.log("Game one turn result: ");
            console.log(turnResults.allPlayersResults);
            io.in(roomName).emit(BackendEventMessage.GAME_ONE_ROUND_RESULT, turnResults.allPlayersResults, turnResults.tripleBonuses, 25,
                turnResults.doubleBonuses, 15);

            if (GameOne.isGameOneDone(room)) {
                // Proceed to game 2
                let finalResults = GameOne.getWinnersAndLosers(roomName);
                io.in(roomName).emit(BackendEventMessage.END_GAME_ONE, finalResults[0], finalResults[1], turnResults.doubleBonuses.length, turnResults.tripleBonuses.length);
                room.advanceToGameTwo();
            } else {
                // Proceed to the next round in game 1
                room.advanceToNextTurn();
            }
        }
    });

    socket.on(FrontendEventMessage.CONFIRM_GAME_TWO, (experimentID, prolificID, competeToken, keepToken, investToken, remainingTime) => {
        // Sanity check
        if (experimentID == -1) {
            return;
        }
        prolificID = prolificID.toString();
        // console.log("Game 2 decision received: ", experimentID, prolificID, competeToken, keepToken, investToken);
        let room = lobby.getRoomByRoomName(experimentID);
        let player = room.getPlayerWithID(prolificID);
        player.setIsBot(false);

        player.recordAllocation(competeToken, keepToken, investToken);
        let payoff = room.getCompeteAndInvestPayoffAtCurrentTurn();
        let competePayoff = payoff[0], investPayoff = payoff[1];
        DB_API.saveAllocationToDB(experimentID, prolificID, keepToken, investToken, competeToken, investPayoff, competePayoff, room.turnNum, player.isBot);

        let computeBonus = room.hasEveryoneConfirmed() || remainingTime <= 0;

        if (computeBonus) { // all players have confirmed choices or timer has run out
            // console.log(room.turnNum - 1);
            // Check player passivity
            const room = lobby.getRoomByRoomName(experimentID);
            const roomName = room.roomName;
            room.players.forEach((currPlayer) => {
                if (!currPlayer.isBot && !lobby.hasPlayerConfirmedChoices(currPlayer.prolificID)) {
                    io.in(roomName).emit(BackendEventMessage.CHECK_PASSIVITY, currPlayer.prolificID);
                    currPlayer.setIsBot(true);
                }
            });

            // generate bot choices
            room.players.forEach((player) => {
                if (player.isBot) {
                    let bot = player;
                    let botAllocation = GameTwo.generateBotAllocation();
                    bot.recordAllocation(botAllocation[0], botAllocation[1], botAllocation[2]); // compete, keep, invest
                    DB_API.saveAllocationToDB(experimentID, bot.prolificID, botAllocation[1], botAllocation[2], botAllocation[0], investPayoff, competePayoff, room.turnNum, true);
                }
            });

            let allocation = room.getTeamAllocationAtCurrentTurn();
            console.log("Game two turn result: ");
            console.log(allocation);
            io.in(room.name).emit(BackendEventMessage.END_GAME_TWO_ROUND, competePayoff, investPayoff, allocation[0].allocationAsArray, allocation[1].allocationAsArray);

            if (GameTwo.isGameTwoDone(room)) {
                io.in(room.name).emit(BackendEventMessage.END_GAME_TWO);
                // marker for the previously final result computation part
            } else {
                room.advanceToNextTurn();
            }
        }
    });

    socket.on(FrontendEventMessage.GET_FINAL_RESULTS, (experimentID, playerProlificID) => {
        // Sanity check
        if (experimentID == -1) {
            return;
        }
        console.log("Results for: " + playerProlificID);
        // Grant bonus to Game 1 winners
        let room = lobby.getRoomByRoomName(experimentID);
        let group = GameOne.getWinnersAndLosers(room.roomName);
        let winners = group[0];
        let gameOneResult = false;
        let gameOneBonus = 0;
        winners.forEach((winner) => {
            if (winner === playerProlificID) {
                gameOneResult = true;
                gameOneBonus = GamesConfig.GAME_ONE_PAYOUT; // Extra payout for winning Game 1
            }
        });
        // Compute the final payout based on a randomly selected turn in Game 2
        let payOutTurnNum = Math.floor(Math.random() * Math.floor(room.turnNum - 1) + 1);
        let allocation = room.getPlayerTeamAllocationAtTurn(playerProlificID, payOutTurnNum + 1); // adjust turnNum to 1-based indexed
        let payoff = room.getCompeteAndInvestPayoffAtTurnNum(payOutTurnNum + 1);
        let competePayoff = payoff[0], investPayoff = payoff[1];
        // keep
        let keepTokens = allocation.keep;
        let keepAmount = keepTokens * GamesConfig.TOKEN_VALUE;
        // invest
        let investTokens = allocation.invest;
        let investRate = investPayoff * GamesConfig.TOKEN_VALUE;
        let investAmount = investTokens * investRate;
        // compete
        let competeTokens = allocation.compete;
        let competeRate = competePayoff * GamesConfig.TOKEN_VALUE;
        let competeAmount = competeTokens * (-1) * competeRate;

        console.log('compete tokens: ' + competeTokens + ' invest tokens: ' + investTokens + ' keep tokens: ' + keepTokens);
        console.log('compete rate: ' + competeRate + ' invest rate: ' + investRate);
        console.log('compete amount: ' + competeAmount + ' invest amount: ' + investAmount + ' keep amount: ' + keepAmount);

        DB_API.savePlayerRecieptTurnNum(experimentID, playerProlificID, payOutTurnNum + 1);
        socket.emit(BackendEventMessage.SEND_FINAL_RESULTS, gameOneResult, gameOneBonus, payOutTurnNum + 1, keepTokens, keepAmount, investTokens, investRate, investAmount, competeTokens, competeRate, competeAmount, GamesConfig.PROLIFIC_COMPLETION_CODE);
    });


    socket.on(FrontendEventMessage.DISCONNECT, () => {
        let prolificID = socket.prolificID;
        console.log(`Player with id ${prolificID} disconnected`);

        if (prolificID !== undefined) {
            let room = lobby.getRoomOfPlayer(prolificID);
            let player = room.getPlayerWithID(prolificID);
            player.setIsBot(true);

            socket.to(room.name).emit(BackendEventMessage.PLAYER_LEAVE_ROOM, "someone left");
            socket.leave(room.name);
        }
    });
})


server.listen(process.env.PORT || 3001, () => {
    console.log("listening on port ", process.env.PORT || 3001);
});
