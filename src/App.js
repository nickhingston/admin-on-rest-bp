

// in src/App.js

import React from 'react';
import { /*jsonServerRestClient,*/ 
    // Admin,
    Resource,
    // Delete,
    resolveBrowserLocale} from 'react-admin';

import Admin from './Admin'

import Login from'./login';

import Dashboard from './Dashboard';
import authClient from './authClient';
import restClient from './restClient';
import Menu from './Menu';

import { PostList, PostEdit, PostCreate } from './posts';
import { UserList, UserEdit, UserCreate } from './users';
import { CaseList, CaseEdit, CaseCreate } from './cases';
import { PlatesList, PlatesEdit, PlatesCreate } from './plates';
import { PlateItemList, PlateItemShow, PlateItemEdit, PlateItemCreate } from './plate-item';
import { AccountList, AccountShow, AccountEdit, AccountCreate } from './accounts';

import customRoutes from './customRoutes'

import PostIcon from '@material-ui/icons/Book'
import UserIcon from '@material-ui/icons/People'
import PlatesIcon from '@material-ui/icons/Group'
import CaseIcon from '@material-ui/icons/Group'
import registerSaga, { registerGetReducer as registrationObj} from './sagas/registerSaga'
import subscriptionSaga, {subscriptionPlanReducer as subscriptionPlanObj } from './sagas/subscriptionSaga'
import { passwordSaga, passwordResetGetReducer as passwordResetObj} from './password'
import enMessages from 'ra-language-english';

import createHistory from 'history/createBrowserHistory';

import msEnMessages from './i18n/messages'

const messages = {
    en: { ...msEnMessages, ...enMessages },
};

const i18nProvider = locale => messages.en;

const history = createHistory({basename: "/admin"});
const apiUrl = process.env.REACT_APP_SERVICE_API;

// TODO: need a way of /auth requests being redirected 
const masterKey = process.env.REACT_APP_MASTER_KEY;

const App = () => {
  //let isAdminUser = (localStorage.user ? JSON.parse(localStorage.user).role === 'admin': false);
  return(
    <Admin  customRoutes={customRoutes} 
            loginPage={Login} 
            authProvider={authClient(apiUrl, masterKey)} 
            dashboard={Dashboard} 
            dataProvider={restClient(apiUrl)}
            history={history}
            menu={Menu} 
            title="vPOP Admin"
            local={resolveBrowserLocale()} 
            i18nProvider={i18nProvider}
            customSagas={[ registerSaga, passwordSaga, subscriptionSaga ]}
            customReducers={{ registrationObj, subscriptionPlanObj, passwordResetObj }} >


        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
        <Resource name="cases" list={CaseList} edit={CaseEdit} create={CaseCreate} icon={CaseIcon} />
        {/* <Resource name="password-resets" edit={PasswordEdit} icon={UserIcon} />  */}

        <Resource name="plates" list={PlatesList} edit={PlatesEdit} create={PlatesCreate} icon={PlatesIcon} />

        <Resource name="plate-items" list={PlateItemList} show={PlateItemShow} edit={PlateItemEdit} create={PlateItemCreate} />
        <Resource name="accounts" list={AccountList} show={AccountShow} edit={AccountEdit} create={AccountCreate} />
        <Resource name="xrays" />
    </Admin>
)};

export default App;

