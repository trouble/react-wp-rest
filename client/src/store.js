import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import ReduxThunk from 'redux-thunk'
import { promiseMiddleware } from './middleware';

import menus from './reducers/menus';
import content from './reducers/content';

const reducers = combineReducers({
	menus,
	content
});

const createStoreWithMiddleware = compose(applyMiddleware(
	ReduxThunk,
	promiseMiddleware
))(createStore);

export default function configureStore(initialState = {}) {
	return createStoreWithMiddleware(reducers, initialState);
}
