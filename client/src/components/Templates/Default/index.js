import React, { Component } from 'react';

import ContentBlock from '../../Utilities/ContentBlock';
import loadPage from '../../loadPage';

import './Default.css';

class Default extends Component {

	render() {

		if (this.props.data) {

			let data = this.props.data;

			return (
				<article className={`${this.props.slug} default-template`}>
					<h1>{data.title.rendered}</h1>
					<ContentBlock content={data.content.rendered} />
				</article>
			);

		} else {
			return <div></div>
		}
	}
}

export default loadPage(Default);