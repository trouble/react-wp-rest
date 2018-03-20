import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_API_URL;

const responseBody = res => res.body;

const requests = {
	get: url =>
		superagent.get(`${API_ROOT}${url}`).then( responseBody )
}

const Menus = {
	main: () =>
		requests.get('/wp-json/menus/main')
}

const Content = {
	static: slug => requests.get(`/wp-json/wp/v2/static-content?slug=${slug}`)
} 

const Pages = {
	bySlug: slug =>
		requests.get(`/wp-json/wp/v2/pages?slug=${slug}`),
	list: () =>
		requests.get('/wp-json/pages/list')
}

export default {
	Menus,
	Content,
	Pages
}