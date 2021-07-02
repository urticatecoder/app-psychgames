const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const DB_API = require('./db/db_api');
const BOT = require("./bot");
const Game1 = require("./game1");
const Game2 = require('./game2');
const lobby = require("./lobby.js").LobbyInstance;
const FrontendEventMessage = require("./frontend_event_message.js").FrontendEventMessage;
const BackendEventMessage = require("./backend_event_message.js").BackendEventMessage;
const GamesConfig = require('./games_config.js');

// Set up mongoose connection
let mongoose = require('mongoose');

/* use the test database if no environment variables named MONGODB_URI are passed in */
let mongoDB_URI = process.env.MONGODB_URI || 'mongodb+srv://xipu:k5q1J0qhOrVb1F65@cluster0.jcnnf.azure.mongodb.net/psych_game?retryWrites=true&w=majority'
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
    //     require('./lobby.js').LobbyBotSocketListener(io, socket);
    // } else {
    //     require('./lobby.js').LobbyDefaultSocketListener(io, socket);
    // }
    require('./lobby.js').LobbyDefaultSocketListener(io, socket);

    // TODO: move to lobby socket listener code
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

    socket.on(FrontendEventMessage.CONFIRM_GAME_ONE, (experimentID, prolificID, choices, zeroTime) => {
        // Sanity check
        if (experimentID == -1) {
            return;
        }
        /*
        prolific = player's prolific id
        choices = [player1chosen, player2chosen]
        minimum chosen players = 1
        */
        prolificID = prolificID.toString();
        let room = lobby.getRoomPlayerIsIn(prolificID);
        let player = room.getPlayerWithID(prolificID);
        player.setIsBot(false);
        player.recordChoices(choices);

        // if everyone has confirmed or timer has reached 0
        const computeBonus = room.hasEveryoneConfirmed() || zeroTime <= 0;
        if (computeBonus) { // all 6 have confirmed choices
            console.log("Computing bonuses");
            let allIDs = lobby.getAllPlayersIDsInRoomWithName(room.roomName);
            room.players.forEach((currPlayer) => {
                if (currPlayer.isBot) {
                    // let all bots select their choices
                    let botChoices = BOT.determineBotChoice(currPlayer.prolificID, allIDs);
                    currPlayer.recordChoices(botChoices);
                } else {
                    if (Game1.isPlayerPassive(currPlayer.prolificID, room)) {
                        // make bot choices for inactive players
                        console.log(currPlayer.prolificID + " is possibly inactive.");
                        io.in(room.name).emit(BackendEventMessage.CHECK_PASSIVITY, currPlayer.prolificID);
                        let botChoices = BOT.determineBotChoice(currPlayer.prolificID, allIDs);
                        currPlayer.recordChoices(botChoices);

                        socket.on(FrontendEventMessage.ACTIVE_PLAYER, (experimentID, playerProlific) => {
                            // Sanity check
                            if (experimentID == -1) {
                                return;
                            }
                            // let it pass
                            console.log(playerProlific + ' in room ' + experimentID + ' is active');
                        });

                        socket.on(FrontendEventMessage.INACTIVE_PLAYER, (experimentID, playerProlific) => {
                            // Sanity check
                            if (experimentID == -1) {
                                return;
                            }
                            // make this player a bot
                            player.setIsBot(true);
                            console.log(playerProlific + ' in room ' + experimentID + ' is inactive');
                        });
                    }
                }
            });
            let singleChoiceCounts = Game1.countSingleChoices(room);
            // emit list of lists of prolificIDs and int of how much to move up of triple bonuses
            let allTripleBonus = Game1.calculateAllTripleBonuses(allIDs, room);
            let tripleBonusCounts = Game1.countTripleBonuses(allTripleBonus, room);
            // emit list of lists of prolificIDs and int of how much to move up of double bonuses
            let allDoubleBonus = Game1.calculateAllDoubleBonuses(allIDs, room);
            let doubleBonusCounts = Game1.countDoubleBonuses(allDoubleBonus, room);
            // players will be emitted to the "net zero" position after showing who selected who (to be implemented)
            let resultForAllPlayers = Game1.getResultsByProlificId(allIDs, room);
            allIDs.forEach((playerID) => {
                let currPlayer = room.getPlayerWithID(playerID);
                DB_API.saveChoiceToDB(experimentID, playerID, currPlayer.getChoiceAtTurn(room.turnNum),
                    room.turnNum, currPlayer.isBot, room.getPlayerOldLocation(playerID), room.getPlayerNewLocation(playerID),
                    singleChoiceCounts.get(playerID), doubleBonusCounts.get(playerID), tripleBonusCounts.get(playerID));
            });

            //turn count for game 1
            room.setGameOneTurnCount(room.gameOneTurnCount + 1);
            if (Game1.isGameOneDone(room)) {
                let group = Game1.getWinnersAndLosers(room);
                room.setGameOneResults(group);
                io.in(room.name).emit(BackendEventMessage.END_GAME_ONE, group[0], group[1], allDoubleBonus.length, allTripleBonus.length);
                room.advanceToGameTwo();
            }
            io.in(room.name).emit(BackendEventMessage.GAME_ONE_ROUND_RESULT, resultForAllPlayers, allTripleBonus, 25,
                allDoubleBonus, 15);
            room.advanceToNextRound();
        }
    });

    socket.on(FrontendEventMessage.CONFIRM_GAME_TWO, (experimentID, prolificID, competeToken, keepToken, investToken) => {
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

        if (room.hasEveryoneConfirmed()) { // all players have confirmed choices
            // console.log(room.turnNum - 1);
            // generate bot choices
            room.players.forEach((player) => {
                if (player.isBot) {
                    let bot = player;
                    let botAllocation = Game2.generateBotAllocation();
                    bot.recordAllocation(botAllocation[0], botAllocation[1], botAllocation[2]); // compete, keep, invest
                    DB_API.saveAllocationToDB(experimentID, bot.prolificID, botAllocation[1], botAllocation[2], botAllocation[0], investPayoff, competePayoff, room.turnNum, true);
                }
            });

            let allocation = room.getTeamAllocationAtCurrentTurn();
            io.in(room.name).emit(BackendEventMessage.END_GAME_TWO_ROUND, competePayoff, investPayoff, allocation[0].allocationAsArray, allocation[1].allocationAsArray);

            if (Game2.isGameTwoDone(room)) {
                io.in(room.name).emit(BackendEventMessage.END_GAME_TWO);

                // marker for the previously final result computation part
            } else {
                room.advanceToNextRound();
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
        let group = Game1.getWinnersAndLosers(room);
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
        socket.emit(BackendEventMessage.SEND_FINAL_RESULTS, gameOneResult, gameOneBonus, payOutTurnNum + 1, keepTokens, keepAmount, investTokens, investRate, investAmount, competeTokens, competeRate, competeAmount);
    });


    socket.on(FrontendEventMessage.DISCONNECT, () => {
        let prolificID = socket.prolificID;
        console.log(`Player with id ${prolificID} disconnected`);

        if (prolificID !== undefined) {
            let room = lobby.getRoomPlayerIsIn(prolificID);
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
