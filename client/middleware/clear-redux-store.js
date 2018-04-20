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
		store.dispatch({ type: 'CLEAR_API_DATA_BY_SLUG', payload: req.params.slug })
		res.redirect(`${req.query.redirect}`);
	}
}