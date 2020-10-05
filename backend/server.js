const app = require("./app");
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Set up mongoose connection
let mongoose = require('mongoose');
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

    socket.on('confirm choice', (choice) => {
        console.log(choice);
        // if all 6 have confirmed choices: emit(each player's movement);
        // else emit('someone has confirmed his/her choice') to 5 other ;
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('left', 'someone left');
        socket.leave(socket.roomName);
    });
})

server.listen(process.env.PORT || 3001, () => {
    console.log("listening on port ", process.env.PORT || 3001);
});
