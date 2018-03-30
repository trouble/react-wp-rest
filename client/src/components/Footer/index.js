import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

class Footer extends Component {

	render() {
		return (
			<footer className="footer">
				<Link to="/">Home</Link>
				<Link to="/home/test">Test</Link>
				<Link to="/posts/hello-world">Hello World</Link>
			</footer>
		);
	}
}

export default Footer;