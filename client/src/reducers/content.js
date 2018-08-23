const defaultState = {
	data: {},
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
					[action.payload[0].slug] : action.payload[0]
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
					[action.payload.slug] : action.payload.menu
				}
			};

		case 'CLEAR_API_CONTENT':

			return {
				...defaultState
			}

		case 'CLEAR_API_DATA_BY_SLUG':

			if (state.data[action.payload]) {
				let newState = { ...state};
				delete newState.data[action.payload];
				return newState;
			}

			return state;

		default:
			return state;
	}
}
