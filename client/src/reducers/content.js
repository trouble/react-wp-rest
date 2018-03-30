const defaultState = {
	data: {},
	lists: {}
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

		default:
			return state;
	}
}