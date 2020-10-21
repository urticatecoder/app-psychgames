const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const DB_API = require('./db/db_api');
const BOT = require("./db/bot");
const {getResultsByProlificId, isGameOneDone, getWinnersAndLosers} = require("./db/results");
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

// let ID1 = '123';
// let ID2 = '456'
// let choices = ['player4', 'player5', 'player9'];
// Promise.all([DB_API.savePlayerChoiceToDB(ID1, choices, 1, false),
//     DB_API.savePlayerChoiceToDB(ID2, choices, 1, true)]).then(() => console.log("Saved!!"));

io.on('connection', socket => {
    console.log('New client connected');

    require('./lobby.js').LobbySocketListener(io, socket);

    socket.on('confirm choice for game 1', (prolificID, choices) => {
        // prolific = prolific id; choices = [player1chosen, player2chosen] *minimum chosen players = 1*
        console.log(choices);
        let room = lobby.getRoomPlayerIsIn(prolificID);
        let player = room.getPlayerWithID(prolificID);
        DB_API.savePlayerChoiceToDB(prolificID, choices, room.turnNum, player.isBot);
        player.recordChoices(choices);
        room.addPlayerIDToConfirmedSet(prolificID);

        // let all bots select their choices
        let allIDs = lobby.getAllPlayersIDsInRoomWithName(room.roomName)
        room.players.forEach((playerInThisRoom) => {
           if(playerInThisRoom.isBot){
               let bot = playerInThisRoom;
               let botChoices = BOT.determineBotChoice(bot.prolificID, allIDs);
               DB_API.savePlayerChoiceToDB(bot.prolificID, botChoices, room.turnNum, true);
               bot.recordChoices(botChoices);
               room.addPlayerIDToConfirmedSet(bot.prolificID);
           }
        });

        if (room.hasEveryoneConfirmedChoiceInThisRoom()){ // all 6 have confirmed choices
            room.advanceToNextRound();
            // calculate each player's new location and send it to everyone in the room
            let room = lobby.getRoomPlayerIsIn(prolific);
            let resultForAllPlayers = getResultsByProlificId(prolificIDArray, room);
            if(isGameOneDone){
                socket.emit('end game 1', getWinnersAndLosers(room));
            }
            io.in(room.name).emit('location for game 1', resultForAllPlayers);
        }
        else{
            // emit('someone has confirmed his/her choice') to 5 other
        }
    });

    socket.on('bot chooses rest of player choice', (prolific) => {
        console.log(prolific);
        let room = lobby.getRoomPlayerIsIn(prolificID);
        let player = room.getPlayerWithID(prolificID);
        BOT.saveBotChoiceToDB(prolific, room.turnNum, player.isBot);
    })

    socket.on('all choices in database', () => {
        console.log('send message indicating all choices are in database');
        // we need to check this before sending the message correct????
        socket.to('room 1').emit('choices sent', 'all choices are in database');
    })
    /* 
    IS NEVER CALLED
    socket.on('results for game 1', (prolificIDArray) => {
        let prolific = prolificIDArray[0];
        let room = lobby.getRoomPlayerIsIn(prolific);
        let resultForAllPlayers = getResultsByProlificId(prolificIDArray, room);
        socket.emit('location', resultForAllPlayers);
        if(isGameOneDone){
            socket.emit('end game one');
        }
    })
    */
    socket.on('disconnect', () => {
        let prolificID = socket.prolificID;
        console.log(`Player with id ${prolificID} disconnected`);
        let room = lobby.getRoomPlayerIsIn(prolificID);
        let player = room.getPlayerWithID(prolificID);
        player.setIsBot(true);

        socket.to(room.name).emit('left', "someone left");
        socket.leave(room.name);
    });
})


server.listen(process.env.PORT || 3001, () => {
    console.log("listening on port ", process.env.PORT || 3001);
});
