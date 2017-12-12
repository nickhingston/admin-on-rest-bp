// copied from admin-on-rest Admin.js

import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
 import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import logger from 'redux-logger'

import { USER_LOGOUT } from 'admin-on-rest/lib/actions/authActions';
import adminReducer from 'admin-on-rest/lib/reducer';
import localeReducer from 'admin-on-rest/lib/reducer/locale';
import { crudSaga } from 'admin-on-rest/lib/sideEffect/saga';
import DefaultLayout from 'admin-on-rest/lib/mui/layout/Layout';
import Menu from 'admin-on-rest/lib/mui/layout/Menu';
import Login from 'admin-on-rest/lib/mui/auth/Login';
import Logout from 'admin-on-rest/lib/mui/auth/Logout';
import TranslationProvider from 'admin-on-rest/lib/i18n/TranslationProvider';

const AdminMS = ({
	appLayout,
	authClient,
    children,
    customReducers = {},
    customSagas = [],
    customRoutes,
    dashboard,
    history,
    locale,
    messages = {},
    menu,
    restClient,
    theme,
    title = 'Admin on REST',
    loginPage,
    logoutButton,
    initialState,
}) => {
    const resources = React.Children.map(children, ({ props }) => props) || [];
    const appReducer = combineReducers({
        admin: adminReducer(resources),
        locale: localeReducer(locale),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });
    const resettableAppReducer = (state, action) => appReducer(action.type !== USER_LOGOUT ? state : undefined, action);
    const saga = function* rootSaga() {
        yield all([
            crudSaga(restClient, authClient),
            ...customSagas,
        ].map(fork));
    };
    const sagaMiddleware = createSagaMiddleware();
    const routerHistory = history || createHistory({basename: "/admin"});
    const store = createStore(resettableAppReducer, initialState, compose(
        applyMiddleware(logger, sagaMiddleware, routerMiddleware(routerHistory)),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ));
    sagaMiddleware.run(saga);

    const logout = authClient ? createElement(logoutButton || Logout) : null;

    return (
		// <div></div>
        <Provider store={store}>
              <TranslationProvider messages={messages}> 
                <ConnectedRouter history={routerHistory}>
                     <div>
                         <Switch>
                            <Route exact path="/login" render={({ location }) => createElement(loginPage || Login, {
                                location,
                                title,
                                theme,
                            })} />
                            <Route path="/" render={() => createElement(appLayout || DefaultLayout, {
                                dashboard,
                                customRoutes,
                                 menu: createElement(menu || Menu, {
                                     logout, 
                                    resources,
                                    hasDashboard: !!dashboard,
                                }), 
                                resources,
                                title,
                                theme,
                            })} />
                        </Switch> 
                    </div> 
                </ConnectedRouter>
            </TranslationProvider> 
        </Provider>
    );
};

const componentPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);

AdminMS.propTypes = {
    appLayout: componentPropType,
    authClient: PropTypes.func,
    children: PropTypes.node,
    customSagas: PropTypes.array,
    customReducers: PropTypes.object,
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    history: PropTypes.object,
    loginPage: componentPropType,
    logoutButton: componentPropType,
    menu: componentPropType,
    restClient: PropTypes.func,
    theme: PropTypes.object,
    title: PropTypes.node,
    locale: PropTypes.string,
    messages: PropTypes.object,
    initialState: PropTypes.object,
};

export default AdminMS;
