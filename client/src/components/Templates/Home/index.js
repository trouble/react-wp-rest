import React, { Component } from 'react';

import loadPage from '../../loadPage';

import './Home.css';

class Home extends Component {

	render() {

		if (this.props.data) {

			const data = this.props.data;

			return (
				<article className="home">
					<h1>{data.title.rendered}</h1>
					<div>
						{data.content.rendered}
					</div>
				</article>
			);
		} else {
			return null;
		}
	};
};

export default loadPage(Home);