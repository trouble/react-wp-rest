import express from 'express';
import Loadable from 'react-loadable';
import serverRenderer from './middleware/renderer';
import clearReduxStore from './middleware/clear-redux-store';
import configureStore from './src/store';

require('dotenv').load();

const store = configureStore();

const app = express();
const path = require('path');
const port = 1337;

app.get('/clear-redux-store/:type/:slug', clearReduxStore.bySlug(store));

app.get('/clear-redux-store', clearReduxStore.all(store));

app.use('^/$', serverRenderer(store));

app.use(express.static(path.join(__dirname, 'build')));

app.use('*', serverRenderer(store));

Loadable.preloadAll().then(() => {
	app.listen(port, (error) => {
		console.log("listening on " + port + "...");
	});
});
