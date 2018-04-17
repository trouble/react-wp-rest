import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

import NotFound from './components/Templates/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadTemplate from './components/LoadTemplate';
import api from './api';

const mapStateToProps = (state) => ({
	pageList: state.content.lists.pages
});

const mapDispatchToProps = (dispatch) => ({
	loadPages: (list) => dispatch({ type: 'LOAD_PAGES_LIST', payload: list })
});

class App extends Component {

	constructor(props) {
		super(props);

		this.buildRoutes = (routes) => {

			if (this.props.pageList && this.props.pageList.length > 0) {
				return [
					<Route
						key="posts"
						render={(props)=>
							<LoadTemplate
							{...props} 
							template="post"
							type="post" />
						}
						exact
						path="/post/:slug"/>,

					routes.map((route, i) => {

						// If home, set path to empty string, = '/'
						route.slug === 'home' 
							? route.path = ''
							: route.path = route.path;

						// If template is blank, set to default
						route.template === '' 
							? route.template = 'default'
							: route.template = route.template;

						return (
							<Route
								render={ (props)=>
									<LoadTemplate
									{...props} 
									template={route.template}
									slug={route.slug}
									type={route.type} />
								}
								exact
								key={i}
								path={`/${route.path}`}/>
						)
					}),

					<Route key="not-found" component={NotFound} />
				]
			}
		}
	}

	componentWillMount() {
		this.props.loadPages(api.Content.pageList());
	}

	render() {
		return (
			<div className={`app`}>
				<Header />
				<Switch>
					{ this.buildRoutes(this.props.pageList) }
				</Switch>
				<Footer />
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));