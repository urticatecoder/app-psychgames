const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const DB_API = require('./db/db_api');
const BOT = require("./db/bot");
const {getResultsByProlificId} = require("./db/results");
const lobby = require("./lobby.js").LobbyInstance;

// Set up mongoose connection
let mongoose = require('mongoose');

/* use the test database if no environment variables named MONGODB_URI are passed in */
let mongoDB_URI = process.env.MONGODB_URI || 'mongodb+srv://xipu:k5q1J0qhOrVb1F65@cluster0.jcnnf.azure.mongodb.net/psych_game?retryWrites=true&w=majority'
mongoose.connect(mongoDB_URI, { useNewUrlParser: true , useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
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

    socket.on('confirm choice for game 1', (prolificID, choices)=> {
        // prolific = prolific id; choices = [player1chosen, player2chosen, player3chosen] *minimum chosen players = 1*, turnNum, isBot boolean
        console.log(choices);
        let room = lobby.getRoomPlayerIsIn(prolificID);
        let player = room.getPlayerWithID(prolificID);
        DB_API.savePlayerChoiceToDB(prolificID, choices, room.turnNum, player.isBot);
        player.recordChoices(choices);
     });

    socket.on('bot chooses rest of player choice', (prolific, turnNum, isBot) => {
        console.log(prolific);
        BOT.saveBotChoiceToDB(prolific, turnNum, isBot);
    })

    socket.on('all choices in database', () => {
        console.log('send message indicating all choices are in database');
        // we need to check this before sending the message correct????
        socket.to('room 1').emit('choices sent','all choices are in database');
    })

    socket.on('results', (prolific, turnNum)=>{
        let result = getResultsByProlificId(prolific, turnNum);
        socket.emit('location', result);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('left', 'someone left');
        socket.leave(socket.roomName);
    });
})


server.listen(process.env.PORT || 3001, () => {
    console.log("listening on port ", process.env.PORT || 3001);
});
