import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { promiseMiddleware } from './middleware';

import api from './reducers/api';

const reducers = combineReducers({ api });

const composeEnhancers = ((typeof window !== 'undefined') && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const createStoreWithMiddleware = composeEnhancers(
	applyMiddleware(promiseMiddleware)
)(createStore);

export default function configureStore(initialState = {}) {
	return createStoreWithMiddleware(reducers, initialState);
}
