const express = require("express");
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/test_api", (req, res) => {
    res.status(200).send("Hello World!");
});

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

module.exports = app;



