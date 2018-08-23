///////////////////////////////////////////////////////
// Fetches data from API and renders template
// based on properties passed from router.
// Also handles loading meta data per template.
///////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';
import queryString from 'qs';

import api from '../../../api';

const AsyncHome = Loadable({
	loader: () => import( /* webpackChunkName: "Home" */ '../Home'),
	loading: () => <div></div>,
});

const AsyncDefault = Loadable({
	loader: () => import( /* webpackChunkName: "Default" */ '../Default'),
	loading: () => <div></div>,
});

const AsyncPost = Loadable({
	loader: () => import( /* webpackChunkName: "Post" */ '../Post'),
	loading: () => <div></div>,
});

const templates = {
	home: AsyncHome,
	default: AsyncDefault,
	post: AsyncPost
}

const mapStateToProps = state => ({
	data: state.content.data
});

const mapDispatchToProps = dispatch => ({
	load: (data) => dispatch({ type: 'LOAD_DATA', payload: data })
});

const canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

class LoadTemplate extends Component {

	constructor(props) {
		super(props);

		this.state = {
			preview: false,

			// Slug will either come from a prop or a URL param from Router
			// Necessary because some slugs come from URL params
			slug: this.props.slug 
				? this.props.slug 
				: this.props.match.params.slug,

			// Default WP REST API expects /pages/ and /posts/ formatting
			// Custom post types are all singular (sigh)
			fetchType: this.props.type === 'page' 
				? 'pages'
				: this.props.type === 'post' 
				? 'posts'
				: this.props.type
		}
	}

	componentWillMount() {
		let params = [];

		// No need to run any of this on server sides
		if (canUseDOM) {
			params = queryString.parse(
				window.location.search, 
				{ ignoreQueryPrefix: true }
			);
		}

		if (params.preview === 'true' && params['_wpnonce']) {
			api.Content.previewDataBySlug( this.props.type, this.state.slug, params['_wpnonce']).then(
				res => {
					this.setState({ preview: res })
				},
				error => {
					console.warn(error);
					this.props.history.push('/not-found');
				}
			);
		} else if (!this.props.data[this.state.slug]) {
			// Load page content from API by slug
			this.props.load(api.Content.dataBySlug(this.state.fetchType, this.state.slug));
		}
	}

	render() {

		const data = this.state.preview 
			? this.state.preview 
			: this.props.data[this.state.slug];

		let Meta = () => null;

		if (data && data.acf) {
			Meta = () => {
				return (
					<Helmet>
						<title>{data.acf.metaTitle}</title>
						<meta name="description" content={data.acf.metaDescription} />
						<meta name="keywords" content={data.acf.metaKeywords} />
					</Helmet>
				)
			}
		}

		const Template = templates[this.props.template];

		return (
			<React.Fragment>
				<Meta />
				<Template data={data} slug={this.state.slug} />
			</React.Fragment>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadTemplate);
