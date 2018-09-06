import { arrayToObject } from '../utilities/convertData';
import postTypes from '../post-types';

const postTypeDefaultState = arrayToObject(postTypes);

const defaultState = {
	data: {
		...postTypeDefaultState
	},
	menus: {},
	lists: {
		pages: []
	}
}

export default (state = defaultState, action) => {
	switch (action.type) {

		case 'LOAD_DATA':

			return {
				...state,
				data: {
					...state.data,
					[action.payload.type]: arrayToObject(action.payload.data, 'slug')
				}
			}

		case 'LOAD_DATA_BY_SLUG':

			return {
				...state,
				data: {
					...state.data,
					[action.payload.type]: {
						...state.data[action.payload.type],
						[action.payload.slug]: action.payload.data[0]
					}
				}
			};

		case 'LOAD_PAGES_LIST':
			return {
				...state,
				lists: {
					...state.lists,
					pages: action.payload
				}
			};

		case 'LOAD_MENU':

			return {
				...state,
				menus: {
					...state.menus,
					[action.payload.slug] : action.payload.menu
				}
			};

		case 'CLEAR_API_CONTENT':

			return {
				...defaultState
			}

		case 'CLEAR_API_DATA_BY_SLUG':

			if (state.data[action.payload.type] && state.data[action.payload.type][action.payload.slug]) {
				
				let newState = { ...state};
				delete newState.data[action.payload.type][action.payload.slug];

				return newState;
			}

			return state;

		default:
			return state;
	}
}
