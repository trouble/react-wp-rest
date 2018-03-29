///////////////////////////////////////////////////////
// Takes a page component and fetches its data from
// API based on the URL path pulled from React Router.
// Also handles loading meta data per page
///////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import api from '../../api';

import './loadPage.css';

const pageWrap = (PassedComponent) => {

	const mapStateToProps = state => ({
		list: state.pages.list,
		pages: state.pages.pages
	});

	const mapDispatchToProps = dispatch => ({
		load: (page) => dispatch({ type: 'LOAD_PAGE', payload: page })
	});

	class PageWrap extends Component {

		componentWillMount() {

			// Load page content from API by slug
			this.props.load(api.Pages.bySlug(this.props.slug));
		}

		render() {

			let page = this.props.pages[this.props.slug];

			let Meta = () => null;

			if (page) {
				Meta = () => {
					return (
						<Helmet>
							<title>{page.acf.metaTitle}</title>
							<meta name="description" content={page.acf.metaDescription} />
							<meta name="keywords" content={page.acf.metaKeywords} />
						</Helmet>
					)
				}
			}

			return (
				<div className="page-wrap">
					<Meta />
					<PassedComponent data={page} slug={this.props.slug} />
				</div>
			);
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(PageWrap);
}

export default pageWrap;