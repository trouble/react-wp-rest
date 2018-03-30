import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from './store';
import App from './App';

if (process.env.NODE_ENV === 'production') {

	const store = configureStore( window.PAGE_STATE || {} );

	window.onload = () => {
		Loadable.preloadReady().then(() => {
			ReactDOM.hydrate(
				<Provider store={store}>
					<Router>
						<App />
					</Router>
				</Provider>
			, document.getElementById('root'));
		})
	}
} else {

	const store = configureStore();

	ReactDOM.render(
		<Provider store={store}>
			<Router>
				<App />
			</Router>
		</Provider>
	, document.getElementById('root'));
}