import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { promiseMiddleware } from './middleware';

import content from './reducers/content';

const reducers = combineReducers({ content });

const composeEnhancers = ((typeof window !== 'undefined') && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const createStoreWithMiddleware = composeEnhancers(
	applyMiddleware(promiseMiddleware)
)(createStore);

export default function configureStore(initialState = {}) {
	return createStoreWithMiddleware(reducers, initialState);
}
