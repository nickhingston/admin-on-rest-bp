import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import withContext from 'recompose/withContext';

import { USER_LOGOUT } from 'ra-core/lib/actions/authActions';

import createAppReducer from 'ra-core/lib/reducer';
import { adminSaga } from 'ra-core/lib/sideEffect';
import { TranslationProvider, defaultI18nProvider } from 'ra-core/lib/i18n';
import formMiddleware from 'ra-core/lib/form/formMiddleware';
import CoreAdminRouter from 'ra-core/lib/CoreAdminRouter';

import {
    Layout as DefaultLayout,
    Loading,
    Login,
    Logout,
    NotFound,
} from 'ra-ui-materialui';

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
    i18nProvider = defaultI18nProvider,
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
    const messages = i18nProvider(locale);
    const appReducer = createAppReducer(customReducers, locale, messages);

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
    const store = createStore(
        resettableAppReducer,
        initialState,
        compose(
            applyMiddleware(
                sagaMiddleware,
                routerMiddleware(routerHistory),
                formMiddleware
            ),
            typeof window !== 'undefined' && window.devToolsExtension
                ? window.devToolsExtension()
                : f => f
        )
    );
    sagaMiddleware.run(saga);

    const logout = authProvider ? createElement(logoutButton) : null;

    return (
        <Provider store={store}>
            <TranslationProvider>
                <ConnectedRouter history={routerHistory}>
                    <Switch>
                        <Route
                            path="/login"
                            render={props =>
                                createElement(loginPage, {
                                    ...props,
                                    title,
                                })
                            }
                        />
						<Route
                            path="/register/:id"
                            render={props =>
                                createElement(registerPage, {
                                    ...props,
                                    title,
                                })
                            }
                        />
                        <Route
                            path="/password-resets/:id"
                            render={props =>
                                createElement(passwordResetPage, {
                                    ...props,
                                    title,
                                })
                            }
                        />
                        <Route
                            path="/"
                            render={props => (
                                <CoreAdminRouter
                                    appLayout={appLayout}
                                    catchAll={catchAll}
                                    customRoutes={customRoutes}
                                    dashboard={dashboard}
                                    loading={loading}
                                    loginPage={loginPage}
                                    logout={logout}
                                    menu={menu}
                                    theme={theme}
                                    title={title}
                                    {...props}
                                >
                                    {children}
                                </CoreAdminRouter>
                            )}
                        />
                    </Switch>
                </ConnectedRouter>
            </TranslationProvider>
        </Provider>
    );
};

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
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
    i18nProvider: PropTypes.func,
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