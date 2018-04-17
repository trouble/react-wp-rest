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
// besides the page requested from the server.
// If not done, initial response would include all pages
// in server Redux store, and it could get huge
const filterDataStore = (state, url) => {

	// Remove leading slash from URL
	let slug = url.replace(/^\/+/g, '');

	// If no slug, assume homepage
	slug = slug.length === 0 ? 'home' : slug;

	// If multiple URL segments, trim to last one (slug)
	slug = slug.substr(slug.lastIndexOf('/') + 1);

	// If data found in state, remove all besides data in question
	if (state.content.data[slug]) {

		return JSON.stringify({
			...state,
			content: {
				...state.content,
				data: {
					[slug]: state.content.data[slug]
				}
			}
		});
	}

	// If no matched data in store, remove all data
	return JSON.stringify({
		...state,
		content: {
			...state.content,
			data: {}
		}
	});
}

export default (store) => (req, res, next) => {

	// point to HTML from CRA
	const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

	fs.readFile(filePath, 'utf8', (err, htmlData) => {
		if (err) {
			console.log('err', err);
			return res.status(404).end();
		}

		// Init empty context necessary for StaticRouter
		const context = {}

		// Build list of modules for Loadable to preload
		const modules = [];

		// Prepare extra chunks as string of script tags to inject into HTML
		const extraChunks = extractAssets(manifest, modules)
			.map(c => `<script type="text/javascript" src="/${c}"></script>`);

		const html = ReactDOMServer.renderToString(
			<Loadable.Capture report={m => modules.push(m)}>
				<Provider store={store}>
					<Router location={req.baseUrl} context={context}>
						<App />
					</Router>
				</Provider>
			</Loadable.Capture>
		);
		
		// Prevent memory leak (React Helmet docs)
		const helmet = Helmet.renderStatic();

		// Respond with HTML, replace necessary strings
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
				filterDataStore(store.getState(), req.baseUrl)
			).replace(
				'</head>',
				`${helmet.title.toString()}${helmet.meta.toString()}</head>`
			)
		);
	});
}