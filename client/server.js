var express = require('express'),
        app = express(),
        path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/build/index.html'));
});

const port = 8080;

app.listen(8080);

console.log('Listening on port ' + port);