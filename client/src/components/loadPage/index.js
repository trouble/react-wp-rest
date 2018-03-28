///////////////////////////////////////////////////////
// Takes a page component and fetches its data from
// API based on the URL path pulled from React Router.
// Also handles loading meta data per page
///////////////////////////////////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';

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

			let meta = {};

			if (page) {
				meta.title = page.acf.metaTitle;
				meta.description = page.acf.metaDescription;
				meta.meta = {
					name: {
						keywords: page.acf.metaKeywords
					}
				}
			}

			return (
				<div className="page-wrap">
					<DocumentMeta {...meta} />
					<PassedComponent data={page} match={this.props.match} />
				</div>
			);
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(PageWrap);
}

export default pageWrap;