import React from "react";
import { Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import { PasswordEdit } from "./password";

export default [
	<Route path="/register/:id" component={Register} />,
	<Route
		path={["/login", "/login/1"]}
		render={(props) => <Login {...props} />}
	/>,
	<Route
		path="/password-resets/:id"
		render={(props) => <PasswordEdit {...props} />}
	/>
];
