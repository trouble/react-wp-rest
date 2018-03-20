import { applyMiddleware, createStore, combineReducers } from 'redux';
import { promiseMiddleware } from './middleware';

import menus from './reducers/menus';
import content from './reducers/content';
import pages from './reducers/pages';

const reducers = combineReducers({
	menus,
	content,
	pages
});

const store = createStore(reducers, applyMiddleware(promiseMiddleware));

export default store;
