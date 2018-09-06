export default {
	all: (store) => (req, res, next) => {
		store.dispatch({ type: 'CLEAR_API_CONTENT' });

		let clearedParam = 'redux-store-cleared=true';

		clearedParam = req.query.redirect.indexOf('?') > -1
			? `&${clearedParam}`
			: `?${clearedParam}`;

		res.redirect(`${req.query.redirect}${clearedParam}`);
	},
	bySlug: (store) => (req, res, next) => {
		let type = req.params.type;

		// Normalize type to match Redux store on server
		if (type === 'page') {
			type = 'pages';
		}

		if (type === 'post') {
			type = 'posts'
		};

		store.dispatch({ type: 'CLEAR_API_DATA_BY_SLUG', payload: {
			type: type,
			slug: req.params.slug
		} })
		res.sendStatus(200);
	}
}
