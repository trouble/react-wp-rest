///////////////////////////////////////////////////////
// Takes a page component and fetches its data from
// API based on the URL path pulled from React Router.
// Also handles loading meta data per page
///////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

import api from '../../api';

import './loadPage.css';

const pageWrap = (PassedComponent) => {

	const mapStateToProps = state => ({
		pages: state.pages.pages
	});

	const mapDispatchToProps = dispatch => ({
		load: (page) => dispatch({ type: 'LOAD_PAGE', payload: page })
	});

	class PageWrap extends Component {

		componentWillMount() {

			// Grab the pathname to get page by slug
			this.slug = this.props.match.path.replace('/', '');

			// If homepage, fetch homepage content
			this.slug = this.slug === '' ? 'home' : this.slug; 

			// Load page content from API by slug
			this.props.load(api.Pages.bySlug(this.slug));
		}

		render() {

			let page = this.props.pages[this.slug];

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
					<PassedComponent data={page} match={this.props.match} />
				</div>
			);
		}
	}

	return withRouter(connect(mapStateToProps, mapDispatchToProps)(PageWrap));
}

export default pageWrap;