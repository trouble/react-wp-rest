///////////////////////////////////////////////////////
// Takes a page component and fetches its data from
// API based on the slug prop passed.
// Also handles loading meta data per page
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

const templates = {
	home: AsyncHome,
	default: AsyncDefault
}

const mapStateToProps = state => ({
	data: state.content.data
});

const mapDispatchToProps = dispatch => ({
	load: (data) => dispatch({ type: 'LOAD_DATA', payload: data })
});

class LoadTemplate extends Component {

	componentWillMount() {

		if (!this.props.data[this.props.slug]) {
			// Load page content from API by slug
			this.props.load(api.Content.dataBySlug(this.props.type, this.props.slug));
		}
	}

	render() {

		let data = this.props.data[this.props.slug];

		let Meta = () => null;

		if (data) {
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
				<Template data={data} slug={this.props.slug} />
			</React.Fragment>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadTemplate);
