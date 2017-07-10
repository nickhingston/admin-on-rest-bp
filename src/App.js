

// in src/App.js

import React from 'react';
import { /*jsonServerRestClient,*/ Admin, Resource, Delete } from 'admin-on-rest';

import Dashboard from './Dashboard';
import authClient from './authClient';
import restClient from './restClient';
import Menu from './Menu';

import { PostList, PostEdit, PostCreate } from './posts';
import { UserList, UserEdit } from './users';

import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';


const apiUrl = process.env.REACT_APP_SERVICE_API;

// TODO: need a way of /auth requests being redirected 
const masterKey = process.env.REACT_APP_MASTER_KEY;

const App = () => {
  //let isAdminUser = (localStorage.user ? JSON.parse(localStorage.user).role === 'admin': false);
  return(
    <Admin authClient={authClient(apiUrl, masterKey)} dashboard={Dashboard} restClient={restClient(apiUrl)} menu={Menu}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} icon={PostIcon}/>
        <Resource name="users" list={UserList} edit={UserEdit} remove={Delete} icon={UserIcon} />
    </Admin>
)};

export default App;

