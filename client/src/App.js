import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Templates/Home';
import Default from './components/Templates/Default';

import api from './api';

import './scss/app.css';

const mapStateToProps = (state) => ({
	pageList: state.pages.list
});

const mapDispatchToProps = (dispatch) => ({
	loadPages: (list) => dispatch({ type: 'LOAD_PAGES_LIST', payload: list })
});

const templates = {
	home: Home,
	default: Default
}

class App extends Component {

	constructor(props) {
		super(props);

		this.buildRoutes = (routes) => {

			if (this.props.pageList && this.props.pageList.length > 0) {
				return [
					routes.map((route, i) => {

						// If home, set path to empty string, = '/'
						route.slug === 'home' 
							? route.path = ''
							: route.path = route.slug;

						// If template is blank, set to default
						route.template === '' 
							? route.template = 'default'
							: route.template = route.template;

						return (
							<Route
								exact
								key={i}
								component={ templates[route.template] }
								path={`/${route.path}`}
							/>
						)
					}),
					<Route key="not-found" render={() => (<Redirect to="/not-found" />)} />
				]
			}
		}
	}

	componentWillMount() {
		this.props.loadPages(api.Pages.list());
	}

	render() {

		return (
			<Router>
				<div className={`app`}>
					<Header />
					<Switch>
						{ this.buildRoutes(this.props.pageList) }
					</Switch>
					<Footer />
				</div>
			</Router>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);