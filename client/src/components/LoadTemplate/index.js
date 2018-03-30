///////////////////////////////////////////////////////
// Fetches data from API and renders template
// based on properties passed from router.
// Also handles loading meta data per template.
///////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Loadable from 'react-loadable';

import api from '../../api';

const AsyncHome = Loadable({
  loader: () => import( /* webpackChunkName: "Home" */ '../Templates/Home'),
  loading: () => <div></div>,
});

const AsyncDefault = Loadable({
  loader: () => import( /* webpackChunkName: "Default" */ '../Templates/Default'),
  loading: () => <div></div>,
});

const AsyncPost = Loadable({
  loader: () => import( /* webpackChunkName: "Post" */ '../Templates/Post'),
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

class LoadTemplate extends Component {

	constructor(props) {
		super(props);

		// Slug will either come from a prop or a URL param from React Router
		this.slug = this.props.slug ? this.props.slug : this.props.match.params.slug;
	}

	componentWillMount() {

		if (!this.props.data[this.slug]) {
			// Load page content from API by slug
			this.props.load(api.Content.dataBySlug(this.props.type, this.slug));
		}
	}

	render() {

		let data = this.props.data[this.slug];

		const Meta = () => {
			return (
				<Helmet>
					<title>
						{ data && data.acf 
							? data.acf.metaTitle
							: 'Default Title' }
					</title>
					<meta name="description" content={
						data && data.acf
							? data.acf.metaDescription
							: 'Default Description'
					} />
					<meta name="keywords" content={
						data && data.acf
							? data.acf.metaKeywords
							: 'Default, key, word'
					} />
				</Helmet>
			)
		}

		const Template = templates[this.props.template];

		return (
			<React.Fragment>
				<Meta />
				<Template data={data} slug={this.slug} />
			</React.Fragment>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadTemplate);