export default {
	all: (store) => (req, res, next) => {
		store.dispatch({ type: 'CLEAR_API_CONTENT' });
		res.redirect(`${req.query.redirect}&redux-store-cleared=true`);
	},
	bySlug: (store) => (req, res, next) => {
		store.dispatch({ type: 'CLEAR_API_DATA_BY_SLUG', payload: req.params.slug })
		res.redirect(`${req.query.redirect}`);
	}
}