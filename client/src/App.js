import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { Helmet } from 'react-helmet';

import Header from './components/Header';
import Footer from './components/Footer';

import api from './api';

import './scss/app.css';

const mapStateToProps = (state) => ({
	pageList: state.pages.list
});

const mapDispatchToProps = (dispatch) => ({
	loadPages: (list) => dispatch({ type: 'LOAD_PAGES_LIST', payload: list })
});

const AsyncHome = Loadable({
  loader: () => import( /* webpackChunkName: "Home" */ './components/Templates/Home'),
  loading: () => <div></div>,
});

const AsyncDefault = Loadable({
  loader: () => import( /* webpackChunkName: "Default" */ './components/Templates/Default'),
  loading: () => <div></div>,
});

const templates = {
	home: AsyncHome,
	default: AsyncDefault
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
			<div className={`app`}>
				<Helmet>
					<title>Default Title</title>
					<meta name="description" content="Default Description" />
					<meta name="keywords" content="Default Keywords" />
				</Helmet>
				<Header />
				<Switch>
					{ this.buildRoutes(this.props.pageList) }
				</Switch>
				<Footer />
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);