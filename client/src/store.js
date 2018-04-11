import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { promiseMiddleware } from './middleware';

import content from './reducers/content';

const reducers = combineReducers({ content });

const createStoreWithMiddleware = compose(applyMiddleware(
	promiseMiddleware
))(createStore);

export default function configureStore(initialState = {}) {
	return createStoreWithMiddleware(reducers, initialState);
}