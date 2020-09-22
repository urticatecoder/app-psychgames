let app = require('express')();
let http = require('http').createServer(app);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on port ', process.env.PORT || 3000);
})
