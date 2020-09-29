const express = require("express");
const app = express();
const path = require('path');

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

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});

module.exports = app;



