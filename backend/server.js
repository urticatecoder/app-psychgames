const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const DB_API = require('./db/db_api');
const BOT = require("./db/bot");
const {getResultsByProlificId, isGameOneDone, getWinnersAndLosers, calculateAllTripleBonuses, calculateAllDoubleBonuses} = require("./db/results");
const Game2 = require('./game2');
const lobby = require("./lobby.js").LobbyInstance;

// Set up mongoose connection
let mongoose = require('mongoose');

/* use the test database if no environment variables named MONGODB_URI are passed in */
let mongoDB_URI = process.env.MONGODB_URI || 'mongodb+srv://xipu:k5q1J0qhOrVb1F65@cluster0.jcnnf.azure.mongodb.net/psych_game?retryWrites=true&w=majority'
mongoose.connect(mongoDB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log("Connected to db successfully.");
});


io.on('connection', socket => {
    console.log('New client connected');

    if (process.env.START_MODE === 'bots_auto_join') {
        require('./lobby.js').LobbyBotSocketListener(io, socket);
    } else {
        require('./lobby.js').LobbyDefaultSocketListener(io, socket);
    }

    socket.on('confirm choice for game 1', (prolificID, choices) => {
        // prolific = prolific id; choices = [player1chosen, player2chosen] *minimum chosen players = 1*
        console.log(choices);
        prolificID = prolificID.toString();
        let room = lobby.getRoomPlayerIsIn(prolificID);
        let player = room.getPlayerWithID(prolificID);
        DB_API.saveChoiceToDB(prolificID, choices, room.turnNum, player.isBot);
        player.recordChoices(choices);
        room.addPlayerIDToConfirmedSet(prolificID);
        // let all bots select their choices
        let allIDs = lobby.getAllPlayersIDsInRoomWithName(room.roomName)
        room.players.forEach((playerInThisRoom) => {
            if (playerInThisRoom.isBot) {
                let bot = playerInThisRoom;
                let botChoices = BOT.determineBotChoice(bot.prolificID, allIDs);
                DB_API.saveChoiceToDB(bot.prolificID, botChoices, room.turnNum, true);
                bot.recordChoices(botChoices);
                room.addPlayerIDToConfirmedSet(bot.prolificID);
            }
        });

        if (room.hasEveryoneConfirmedChoiceInThisRoom()) { // all 6 have confirmed choices
            //emit list of lists of prolificIDs and int of how much to move up of triple bonuses
            let allTripleBonus = calculateAllTripleBonuses(allIDs, room);
            //emit list of lists of prolificIDs and int of how much to move up of double bonuses
            let allDoubleBonus = calculateAllDoubleBonuses(allIDs, room);
            //players will be emitted to the "net zero" position after showing who selected who (to be implemented)
            let resultForAllPlayers = getResultsByProlificId(allIDs, room);
            //turn count for game 1
            room.setGameOneTurnCount(room.gameOneTurnCount + 1);
            if (isGameOneDone(room)) {
                let group = getWinnersAndLosers(room);
                room.setGameOneResults(group);
                io.in(room.name).emit('end game 1', group[0], group[1], allDoubleBonus.length, allTripleBonus.length);
                room.advanceToGameTwo();
            }
            io.in(room.name).emit('location for game 1', resultForAllPlayers, allTripleBonus, 25,
                allDoubleBonus, 15);
            room.advanceToNextRound();
        } else {
            // emit('someone has confirmed his/her choice') to 5 other
        }
    });

    socket.on('confirm choice for game 2', (prolificID, competeToken, keepToken, investToken) => {
        prolificID = prolificID.toString();
        console.log("Game 2 decision received: ", prolificID, competeToken, keepToken, investToken);
        let room = lobby.getRoomPlayerIsIn(prolificID);
        let player = room.getPlayerWithID(prolificID);
        player.setIsBot(false);

        player.recordAllocationForGameTwo(competeToken, keepToken, investToken);
        let payoff = room.getCompeteAndInvestPayoffAtCurrentTurn();
        DB_API.saveAllocationToDB(prolificID, keepToken, investToken, competeToken, payoff[1], payoff[0], room.turnNum, player.isBot);
        room.addPlayerIDToConfirmedSet(prolificID);

        // let all bots select their choices
        room.players.forEach((playerInThisRoom) => {
            if (playerInThisRoom.isBot && playerInThisRoom.prolificID !== prolificID) {
                let bot = playerInThisRoom;
                let botAllocation = Game2.generateBotAllocation();
                bot.recordAllocationForGameTwo(botAllocation[0], botAllocation[1], botAllocation[2]); // compete, keep, invest
                DB_API.saveAllocationToDB(bot.prolificID, botAllocation[1], botAllocation[2], botAllocation[0], payoff[1], payoff[0], room.turnNum, true);
                room.addPlayerIDToConfirmedSet(bot.prolificID);
            }
        });

        if (room.hasEveryoneConfirmedChoiceInThisRoom()) { // all 6 have confirmed choices
            if (Game2.isGameTwoDone(room)) {
                io.in(room.name).emit('end game 2');
            } else {
                let allocation = room.getTeamAllocationAtCurrentTurn();
                room.advanceToNextRound();
                let payoff = room.getCompeteAndInvestPayoffAtCurrentTurn(); // payoff for next turn
                let competePayoff = payoff[0], investPayoff = payoff[1];
                io.in(room.name).emit('end current turn for game 2', competePayoff, investPayoff, allocation[0], allocation[1]);

            }
        }
    });


    socket.on('disconnect', () => {
        let prolificID = socket.prolificID;
        console.log(`Player with id ${prolificID} disconnected`);

        if (prolificID !== undefined) {
            let room = lobby.getRoomPlayerIsIn(prolificID);
            let player = room.getPlayerWithID(prolificID);
            player.setIsBot(true);

            socket.to(room.name).emit('left', "someone left");
            socket.leave(room.name);
        }
    });
})


server.listen(process.env.PORT || 3001, () => {
    console.log("listening on port ", process.env.PORT || 3001);
});
