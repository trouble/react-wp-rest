import React from 'react';
import ReactDOMServer from 'react-dom/server';
import dotenv from 'dotenv/config';
import Loadable from 'react-loadable';
import manifest from '../build/asset-manifest.json';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom'
import DocumentMeta from 'react-document-meta';

import App from '../src/App';

require('dotenv').load();

const path = require('path');
const fs = require('fs');

const extractAssets = (assets, chunks) => Object.keys(assets)
	.filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
	.map(k => assets[k]);

export default (store) => (req, res, next) => {
	// point to HTML from CRA
	const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

	fs.readFile(filePath, 'utf8', (err, htmlData) => {
		if (err) {
			console.log('err', err);
			return res.status(404).end();
		}

		const context = {}

		const modules = [];

		const extraChunks = extractAssets(manifest, modules)
			.map(c => `<script type="text/javascript" src="/${c}"></script>`);

		const html = ReactDOMServer.renderToString(
			<Loadable.Capture report={m => modules.push(m)}>
				<Provider store={store}>
					<Router location={req.url} context={context}>
						<App />
					</Router>
				</Provider>
			</Loadable.Capture>
		);

		const meta = DocumentMeta.renderAsHTML();

		const reduxState = JSON.stringify(store.getState());

		if (context.url) {
			// Somewhere a `<Redirect>` was rendered
			redirect(301, context.url)
		} else {
			return res.send(
				htmlData.replace(
					`<div id="root"></div>`,
					`<div id="root">${html}</div>`
				)
				.replace(
					'</body>',
					extraChunks.join('') + '</body>'
				)
				.replace(
					'"__SERVER_REDUX_STATE__"',
					reduxState
				).replace(
					'</head>',
					`${meta}</head>`
				)
			);
		}
	});
}