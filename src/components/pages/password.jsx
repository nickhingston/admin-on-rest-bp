import React, { useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
	SimpleForm,
	TextInput,
	CREATE,
	GET_ONE,
	UPDATE,
	showNotification,
	Notification,

} from "react-admin";

import { withStyles } from "@material-ui/core/styles";
import { Card, CardHeader } from "@material-ui/core";
import { put, takeEvery } from "redux-saga/effects";


// reducers
export const passwordResetGetReducer = (previousState = null, { type, payload }) => {
	if (type === "PASSWORD_RESET_GET_REQUEST_SUCCESS") {
		return payload.data;
	}
	return previousState;
};

// action
export const PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST";
export const passwordReset = (token, data) => ({
	type: PASSWORD_RESET_REQUEST,
	payload: { access_token: token, data: { ...data } },
	meta: { resource: "password-resets", fetch: CREATE, cancelPrevious: false },
});

export const PASSWORD_UPDATE_REQUEST = "PASSWORD_UPDATE_REQUEST";
export const passwordUpdate = (token, data) => ({
	type: PASSWORD_UPDATE_REQUEST,
	payload: { id: token, data: { ...data } },
	meta: { resource: "password-resets", fetch: UPDATE, cancelPrevious: false },
});

export const PASSWORD_RESET_GET_REQUEST = "PASSWORD_RESET_GET_REQUEST";
export const getPasswordReset = (id) => ({
	type: PASSWORD_RESET_GET_REQUEST,
	payload: { id },
	meta: { resource: "password-resets", fetch: GET_ONE, cancelPrevious: false },
});


// saga
function* handlePasswordResetRequestSuccess() {
	yield put(showNotification("mothership_admin.password.request_sent"));
}

function* handlePasswordResetRequestFailure({ error }) {
	console.log(error);
	yield put(showNotification("mothership_admin.password.request_failed", "warning"));
}

function* handlePasswordResetGetRequestFailure(a) {
	console.log(a);
	yield put(showNotification("mothership_admin.password.get_request_failed_404", "warning"));
	yield put(push("/"));
}

function* handlePasswordUpdateRequestFailure({ error }) {
	yield put(showNotification(error, "warning"));
}

function* handlePasswordUpdateRequestSuccess() {
	yield put(showNotification("mothership_admin.password.update_succeeded"));
	yield put(push("/"));
}

export const passwordSaga = function* passwordSaga() {
	yield takeEvery("PASSWORD_RESET_REQUEST_SUCCESS", handlePasswordResetRequestSuccess);
	yield takeEvery("PASSWORD_RESET_REQUEST_FAILURE", handlePasswordResetRequestFailure);
	yield takeEvery("PASSWORD_RESET_GET_REQUEST_FAILURE", handlePasswordResetGetRequestFailure);
	yield takeEvery("PASSWORD_UPDATE_REQUEST_FAILURE", handlePasswordUpdateRequestFailure);
	yield takeEvery("PASSWORD_UPDATE_REQUEST_SUCCESS", handlePasswordUpdateRequestSuccess);
};

// ui
const styles = (theme) => ({
	main: {
		display: "flex",
		flexDirection: "column",
		minHeight: "100vh",
		height: "1px",
		alignItems: "center",
		justifyContent: "flex-start",
		background: "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://vpop-pro.com/images/IMG_6726.jpg)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
	},
	textField: {
		// marginLeft: theme.spacing.unit,
		// marginRight: theme.spacing.unit,
		// width: 300,
	},
	card: {
		minWidth: 450,
		marginTop: "6em",
	},
	cardHeader: {
		margin: "1em",
		display: "flex",
		justifyContent: "center",
	},
	icon: {
		backgroundColor: theme.palette.secondary[500],
	},
});

const PasswordEditClass = (props) => {
	const {
		passwordResetObj,
		match,
		classes
	} = props;

	useEffect(() => {
		getPasswordReset(match.params.id);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submit = (values) => {
		if (values.password === values.repeat_password) {
			passwordUpdate(match.params.id, {
				password: values.password,
				email: passwordResetObj.user.email
			});
		}
		else {
			showNotification("mothership_admin.password.passwords_must_match", "warning");
		}
	};

	const { user } = passwordResetObj || {};

	return (
		<div
			className={classes.main}
			// {...sanitizeRestProps(rest)}
		>
			<Card className={classes.card}>
				{/* <div className={classes.cardHeader}> */}
				<CardHeader title="Password Reset" subheader={user && user.email} />
				{/* </div> */}


				<SimpleForm redirect="/" record={passwordResetObj} save={submit}>
					<TextInput source="password" type="password" />
					<TextInput source="repeat_password" type="password" />
				</SimpleForm>
			</Card>
			<Notification />
		</div>
	);
};

const mapStateToProps = (state) => ({ passwordResetObj: state.passwordResetObj });

export const PasswordEdit = withStyles(styles)(connect(mapStateToProps, {
	getPasswordReset,
	passwordReset,
	passwordUpdate,
	showNotification
})(PasswordEditClass));
