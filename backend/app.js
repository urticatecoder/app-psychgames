const express = require("express");
const app = express();
const path = require('path');
const lobby = require('./lobby.js').LobbyInstance;

app.use(function(req, res, next) {
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
    }
    else if (prolificID === 'CS307') { // for testing purpose
        isValid = false;
        error = 'Not a code registered by Prolific.'
    }
    else if (lobby.playerToRoom.has(prolificID)) {
        isValid = false;
        error = 'Duplicated prolificID found.';
    }
    res.status(200).send({'isValid': isValid, 'error': error});
}));

app.get("/download", (req, res) => {
    res.status(200).send("sjfioasjiodjsaiodjzxc");
   // res.status(200).json([{
   //      "id": 1,
   //      "first_name": "Jeanette",
   //      "last_name": "Penddreth",
   //      "email": "jpenddreth0@census.gov",
   //      "gender": "Female",
   //      "ip_address": "26.58.193.2"
   //  }, {
   //      "id": 2,
   //      "first_name": "Giavani",
   //      "last_name": "Frediani",
   //      "email": "gfrediani1@senate.gov",
   //      "gender": "Male",
   //      "ip_address": "229.179.4.212"
   //  }, {
   //      "id": 3,
   //      "first_name": "Noell",
   //      "last_name": "Bea",
   //      "email": "nbea2@imageshack.us",
   //      "gender": "Female",
   //      "ip_address": "180.66.162.255"
   //  }, {
   //      "id": 4,
   //      "first_name": "Willard",
   //      "last_name": "Valek",
   //      "email": "wvalek3@vk.com",
   //      "gender": "Male",
   //      "ip_address": "67.76.188.26"
   //  }])
});

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});

module.exports = app;



