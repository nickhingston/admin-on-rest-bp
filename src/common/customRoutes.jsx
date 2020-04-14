import React from "react";
import { Route } from "react-router-dom";
import Register from "components/pages/register";
import Login from "components/pages/login";
import { PasswordEdit } from "components/pages/password";

export default [
	<Route path="/register/:id" component={Register} />,
	<Route
		path={["/login", "/login/1"]}
		render={(props) => <Login {...props} />}
		noLayout
	/>,
	<Route
		path="/password-resets/:id"
		render={(props) => <PasswordEdit {...props} />}
	/>
];
