const defaultState = {
	main: []
}

export default (state = defaultState, action) => {

	switch (action.type) {
		case 'LOAD_MAIN_MENU':

			return {
				...state,
				main: action.payload
			};

		default:
			return state;
	}
}