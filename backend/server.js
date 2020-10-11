const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./db/db_api');

//Set up mongoose connection
let mongoose = require('mongoose');
const { findPlayerByID, savePlayerChoiceToDB } = require("./db/db_api");
const BOT = require("./db/bot");
/* use the test database if no environment variables named MONGODB_URI are passed in */
let mongoDB_URI = process.env.MONGODB_URI || 'mongodb+srv://xipu:k5q1J0qhOrVb1F65@cluster0.jcnnf.azure.mongodb.net/psych_game?retryWrites=true&w=majority'
mongoose.connect(mongoDB_URI, { useNewUrlParser: true , useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connected to db successfully.");
});

io.on('connection', socket => {
    console.log('New client connected');

    require('./lobby.js').LobbySocketListener(io, socket);
    
    socket.on('confirm choice', (prolific, choices, turnNum, isBot)=> {
        // prolific = prolific id; choices = [player1chosen, player2chosen, player3chosen] *minimum chosen players = 1*, turnNum, isBot boolean
        console.log(choices);
        savePlayerChoiceToDB(prolific, selectedPlayer, turnNum, isBot);
       
     })

    socket.on('bot chooses rest of player choice', (prolific, turnNum, isBot) => {
        console.log(prolific);
        BOT.saveBotChoiceToDB(prolific, turnNum, isBot);
        //place method to savePlayerChoicesByBot for specific prolific ID
    })

    socket.on('all choices in database', () => {
        console.log('send message indicating all choices are in database');
        socket.to('room 1').emit('choices sent','all choices are in database');
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
