
// in src/App.js

import React from "react";
import { /* jsonServerRestClient, */
	Admin,
	Resource,
	// Delete,
	resolveBrowserLocale
} from "react-admin";

// import  from './Admin'

import PostIcon from "@material-ui/icons/Book";
import UserIcon from "@material-ui/icons/People";
import { PlatesIcon, CaseIcon } from "@material-ui/icons/Group";
import { createBrowserHistory as createHistory } from "history";
import Login from "components/pages/login";

import { PostList, PostEdit, PostCreate } from "components/pages/posts";
import { UserList, UserEdit, UserCreate } from "components/pages/users";
import { CaseList, CaseEdit, CaseCreate } from "components/pages/cases";
import { PlatesList, PlatesEdit, PlatesCreate } from "components/pages/plates";
import {
	PlateItemList, PlateItemShow, PlateItemEdit, PlateItemCreate
} from "components/pages/plate-item";

import registerSaga, { registerGetReducer as registrationObj } from "sagas/registerSaga";
import accountUserSaga from "sagas/accountUserSaga";
import subscriptionSaga, { subscriptionPlanReducer as subscriptionPlanObj } from "sagas/subscriptionSaga";
import { passwordSaga, passwordResetGetReducer as passwordResetObj } from "components/pages/password";
import Dashboard from "components/pages/Dashboard";
import Menu from "components/organisms/Menu";
import {
	AccountList, AccountShow, AccountEdit, AccountCreate
} from "components/pages/accounts";
import authClient from "common/authClient";
import restClient from "common/restClient";
import customRoutes from "common/customRoutes";
import i18nProvider from "./i18n/i18nProvider";

const history = createHistory({ basename: "/admin" });
const apiUrl = process.env.REACT_APP_SERVICE_API;

// TODO: need a way of /auth requests being redirected
const masterKey = process.env.REACT_APP_MASTER_KEY;

const App = () => (
	<Admin
		customRoutes={customRoutes}
		loginPage={Login}
		authProvider={authClient(apiUrl, masterKey)}
		dashboard={Dashboard}
		dataProvider={restClient(apiUrl)}
		history={history}
		menu={Menu}
		title="vPOP Admin"
		local={resolveBrowserLocale()}
		i18nProvider={i18nProvider}
		customSagas={[registerSaga, passwordSaga, subscriptionSaga, accountUserSaga]}
		customReducers={{
			registrationObj,
			subscriptionPlanObj,
			passwordResetObj
		}}
	>
		<Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
		<Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
		<Resource name="cases" list={CaseList} edit={CaseEdit} create={CaseCreate} icon={CaseIcon} />
		<Resource name="plates" list={PlatesList} edit={PlatesEdit} create={PlatesCreate} icon={PlatesIcon} />
		<Resource name="plate-items" list={PlateItemList} show={PlateItemShow} edit={PlateItemEdit} create={PlateItemCreate} />
		<Resource name="accounts" list={AccountList} show={AccountShow} edit={AccountEdit} create={AccountCreate} />
		<Resource name="xrays" />
	</Admin>
);

export default App;
