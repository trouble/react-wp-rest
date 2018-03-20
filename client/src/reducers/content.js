const defaultState = {
	static: {}
}

export default (state = defaultState, action) => {
	switch (action.type) {

		case 'LOAD_STATIC_CONTENT':

			return {
				...state,
				static: {
					...state.static,
					[action.payload[0].slug] : action.payload[0]
				}
			};

		default:
			return state;
	}
}