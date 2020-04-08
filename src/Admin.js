import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter, routerMiddleware, connectRouter } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import withContext from 'recompose/withContext';
import { messages } from "./i18n/i18nProvider";

import { USER_LOGOUT } from 'ra-core/lib/actions/authActions';

import {
	Layout as DefaultLayout,
	Loading,
	Login,
	Logout,
	NotFound,
	adminSaga,
	CoreAdminRouter,
	createAppReducer,
	TranslationProvider
} from 'react-admin';

import Register from './register'
import { PasswordEdit } from './password'

const CoreAdmin = ({
	appLayout,
	authProvider,
	children,
	customReducers = {},
	customSagas = [],
	customRoutes = [],
	dashboard,
	history,
	menu, // deprecated, use a custom layout instead
	catchAll,
	dataProvider,
	i18nProvider,
	theme,
	title = 'React Admin',
	loading,
	loginPage,
	registerPage,
	passwordResetPage,
	logoutButton,
	initialState,
	locale = 'en',
}) => {

	/*const appReducer = createAppReducer(customReducers, locale, messages);

	const resettableAppReducer = (state, action) =>
		appReducer(action.type !== USER_LOGOUT ? state : undefined, action);
	const saga = function* rootSaga() {
		yield all(
			[
				adminSaga(dataProvider, authProvider, i18nProvider),
				...customSagas,
			].map(fork)
		);
	};
	const sagaMiddleware = createSagaMiddleware();
	const routerHistory = history || createHistory();
	const rootReducer = (routerHistory) => combineReducers({
		router: connectRouter(routerHistory),
		resettableAppReducer
	})
console.log(combineReducers({
	router: connectRouter(routerHistory),
	resettableAppReducer
}))
	const store = createStore(
		rootReducer(routerHistory),
		initialState,
		compose(
			applyMiddleware(
				sagaMiddleware,
				// logger, 
				routerMiddleware(routerHistory)
			),
			typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
				? window.__REDUX_DEVTOOLS_EXTENSION__()
				: f => f
		)
	);
	sagaMiddleware.run(saga);
*/
	const logout = authProvider ? createElement(logoutButton) : null;
	
	return (
		<TranslationProvider i18nProvider={i18nProvider}>
			<CoreAdminRouter
				layout={appLayout}
				catchAll={catchAll}
				customRoutes={customRoutes}
				dashboard={dashboard}
				loading={loading}
				loginPage={loginPage}
				logout={logout}
				menu={menu}
				//  theme={theme}
				title={title}
			>
				{children}
			</CoreAdminRouter>
		</TranslationProvider>
	);
};

const componentPropType = PropTypes.oneOfType([
	PropTypes.func,
	PropTypes.string,
	PropTypes.object
]);

CoreAdmin.propTypes = {
	appLayout: componentPropType,
	authProvider: PropTypes.func,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	catchAll: componentPropType,
	customSagas: PropTypes.array,
	customReducers: PropTypes.object,
	customRoutes: PropTypes.array,
	dashboard: componentPropType,
	dataProvider: PropTypes.func.isRequired,
	history: PropTypes.object,
	i18nProvider: PropTypes.object,
	initialState: PropTypes.object,
	loading: componentPropType,
	locale: PropTypes.string,
	loginPage: componentPropType,
	registerPage: componentPropType,
	passwordResetPage: componentPropType,
	logoutButton: componentPropType,
	menu: componentPropType,
	theme: PropTypes.object,
	title: PropTypes.node,
};

const CoreAdminContext = withContext(
	{
		authProvider: PropTypes.func,
	},
	({ authProvider }) => ({ authProvider })
)(CoreAdmin);

const Admin = CoreAdminContext;

Admin.defaultProps = {
	appLayout: DefaultLayout,
	catchAll: NotFound,
	loading: Loading,
	loginPage: Login,
	registerPage: Register,
	passwordResetPage: PasswordEdit,
	logoutButton: Logout,
};

export default Admin;