import React from 'react';
import ReactDOMServer from 'react-dom/server';
import dotenv from 'dotenv/config';
import Loadable from 'react-loadable';
import manifest from '../build/asset-manifest.json';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import postTypes from '../src/post-types';
import { arrayToObject } from '../src/utilities/convertData';

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

	// Store URL segments
	let segments = slug.split('/');

	// If multiple URL segments, trim to last one (slug)
	slug = slug.substr(slug.lastIndexOf('/') + 1);

	// If more than 1 URL segment, set type equal to first segment
	// If no match from postTypes, set default of pages
	let type = postTypes.indexOf(segments[0]) > -1
		? postTypes[postTypes.indexOf(segments[0])]
		: 'pages';

	// If data found in state, remove all besides data in question
	if (state.api.data[type][slug]) {

		return JSON.stringify({
			...state,
			api: {
				...state.api,
				data: {
					...arrayToObject(postTypes),
					[type]: {
						[slug]: state.api.data[type][slug]
					}
				}
			}
		});
	}

	// If no matched data in store, remove all data
	return JSON.stringify({
		...state,
		api: {
			...state.api,
			data: {
				...arrayToObject(postTypes)
			}
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
