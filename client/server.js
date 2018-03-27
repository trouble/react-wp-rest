import express from 'express';
import serverRenderer from './middleware/renderer';

const app = express();
const path = require('path');
const port = 1337;

app.use('^/$', serverRenderer);

app.use(express.static(path.join(__dirname, 'build')));

app.use('*', serverRenderer);

app.listen(port);

console.log('Listening on port ' + port);
