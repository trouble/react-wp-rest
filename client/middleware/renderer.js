import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../src/App';

const path = require('path');
const fs = require('fs');

export default (req, res, next) => {
	// point to HTML from CRA
	const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

	fs.readFile(filePath, 'utf8', (err, htmlData) => {
		if (err) {
			console.log('err', err);
			return res.status(404).end();
		}

		const html = ReactDOMServer.renderToString(<App />);

		return res.send(
			htmlData.replace(
				`<div id="root"></div>`,
				`<div id="root">${html}</div>`
			)
		)
	});
}