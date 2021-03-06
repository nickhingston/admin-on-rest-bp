

// in src/App.js

import React from 'react';
import { /*jsonServerRestClient,*/ 
    // Admin,
    Resource,
    Delete,
    resolveBrowserLocale} from 'admin-on-rest';

import AdminMS from './AdminMS'

import Login from'./login';

import Dashboard from './Dashboard';
import authClient from './authClient';
import restClient from './restClient';
import Menu from './Menu';

import { PostList, PostEdit, PostCreate } from './posts';
import { UserList, UserEdit, UserCreate } from './users';
import { PasswordEdit } from './password'

import customRoutes from './customRoutes'

import PostIcon from 'material-ui/svg-icons/action/book'
import UserIcon from 'material-ui/svg-icons/social/group'
import registerSaga, {registerGetReducer as registrationObj} from './registerSaga'
import { passwordSaga } from './password'
import enMessages from './i18n/messages'


const messages = {
    en: enMessages,
};

const apiUrl = process.env.REACT_APP_SERVICE_API;

// TODO: need a way of /auth requests being redirected 
const masterKey = process.env.REACT_APP_MASTER_KEY;

const App = () => {
  //let isAdminUser = (localStorage.user ? JSON.parse(localStorage.user).role === 'admin': false);
  return(
    <AdminMS  customRoutes={customRoutes} 
            loginPage={Login} 
            authClient={authClient(apiUrl, masterKey)} 
            dashboard={Dashboard} 
            restClient={restClient(apiUrl)} 
            menu={Menu} 
            local={resolveBrowserLocale()} 
            messages={messages}
            customSagas={[ registerSaga, passwordSaga ]}
            customReducers={{ registrationObj }} >


         <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} icon={PostIcon} />
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} remove={Delete} icon={UserIcon} />
        <Resource name="password-resets" edit={PasswordEdit} icon={UserIcon} /> 
    </AdminMS>
)};

export default App;

