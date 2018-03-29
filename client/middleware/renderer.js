import React from 'react';
import ReactDOMServer from 'react-dom/server';
import dotenv from 'dotenv/config';
import Loadable from 'react-loadable';
import manifest from '../build/asset-manifest.json';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom'
import { Helmet } from 'react-helmet';

import api from '../src/api';
import App from '../src/App';

const path = require('path');
const fs = require('fs');

// Extracts filesnames from all code split chunks
// imported from the manifest given by CRA / Webpack / Loadable
const extractAssets = (assets, chunks) => Object.keys(assets)
	.filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
	.map(k => assets[k]);

// This function removes all pages 
// besides the page requested from the server
const filterPageStore = (state, url) => {

	// Remove leading slash from URL
	let slug = url.replace(/^\/+/g, '');

	// If no slug, assume homepage
	slug = slug.length === 0 ? 'home' : slug;

	// If page found in state, remove all besides page in question
	if (state.pages.pages[slug]) {

		return JSON.stringify({
			...state,
			pages: {
				pages: {
					[slug]: state.pages.pages[slug]
				}
			}
		});
	}

	return JSON.stringify(state);
}

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
					<Router location={req.originalUrl} context={context}>
						<App />
					</Router>
				</Provider>
			</Loadable.Capture>
		);

		const helmet = Helmet.renderStatic();

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
				'"__SERVER_PAGE_STATE__"',
				filterPageStore(store.getState(), req.originalUrl)
			).replace(
				'</head>',
				`${helmet.title.toString()}${helmet.meta.toString()}</head>`
			)
		);
	});
}