const defaultState = {
	pages: {},
	list: []
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'LOAD_PAGE':

			return {
				...state,
				pages: {
					...state.pages,
					[action.payload[0].slug] : action.payload[0]
				}
			};

		case 'LOAD_PAGES_LIST':
			return {
				...state,
				list: action.payload
			};

		default: 
			return state;
	}
}