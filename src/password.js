import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { 
	SimpleForm,
	TextInput,
	CREATE,
	GET_ONE,
	UPDATE,
	showNotification,
	Notification,

} from 'react-admin';

import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader  } from '@material-ui/core';
import { put, takeEvery } from 'redux-saga/effects';


// reducers
export const passwordResetGetReducer = (previousState = null, { type, payload }) => {
    if (type === 'PASSWORD_RESET_GET_REQUEST_SUCCESS') {
        return payload.data;
    }
    return previousState;
}

// action
export const PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST';
export const passwordReset = (token, data) => {
    return ({
        type: PASSWORD_RESET_REQUEST,
        payload: { access_token:token, data: { ...data}  },
        meta: { resource: 'password-resets', fetch: CREATE, cancelPrevious: false },
    })
}

export const PASSWORD_UPDATE_REQUEST = 'PASSWORD_UPDATE_REQUEST';
export const passwordUpdate = (token, data) => {
    return ({
        type: PASSWORD_UPDATE_REQUEST,
        payload: { id:token, data: { ...data}  },
        meta: { resource: 'password-resets', fetch: UPDATE, cancelPrevious: false },
    })
}

export const PASSWORD_RESET_GET_REQUEST = 'PASSWORD_RESET_GET_REQUEST';
export const getPasswordReset = (id) => {
    return ({
        type: PASSWORD_RESET_GET_REQUEST,
        payload: { id  },
        meta: { resource: 'password-resets', fetch: GET_ONE, cancelPrevious: false },
    })
}



// saga
function *handlePasswordResetRequestSuccess() {
     yield put(showNotification('mothership_admin.password.request_sent'))
}

function *handlePasswordResetRequestFailure({error}) {
    console.log(error)
     yield put(showNotification('mothership_admin.password.request_failed', 'warning'))
}

function *handlePasswordResetGetRequestFailure(a) {
    console.log(a)
	 yield put(showNotification('mothership_admin.password.get_request_failed_404', 'warning'))
	 yield put(push('/'))
}

function *handlePasswordUpdateRequestFailure({ error }) {
	 yield put(showNotification(error, 'warning'))
}

function *handlePasswordUpdateRequestSuccess(a) {
	yield put(showNotification('mothership_admin.password.update_succeeded'))
	yield put(push('/'))
}

export const passwordSaga = function *passwordSaga() {
    yield takeEvery('PASSWORD_RESET_REQUEST_SUCCESS', handlePasswordResetRequestSuccess)
	yield takeEvery('PASSWORD_RESET_REQUEST_FAILURE', handlePasswordResetRequestFailure)
	yield takeEvery('PASSWORD_RESET_GET_REQUEST_FAILURE', handlePasswordResetGetRequestFailure)
	yield takeEvery('PASSWORD_UPDATE_REQUEST_FAILURE', handlePasswordUpdateRequestFailure)
	yield takeEvery('PASSWORD_UPDATE_REQUEST_SUCCESS', handlePasswordUpdateRequestSuccess)
}

// ui
const styles = theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '1px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://vpop-pro.com/images/IMG_6726.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
	},
	textField: {
		// marginLeft: theme.spacing.unit,
		// marginRight: theme.spacing.unit,
		// width: 300,
	},
    card: {
        minWidth: 450,
        marginTop: '6em',
    },
    cardHeader: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        backgroundColor: theme.palette.secondary[500],
    },
});

class PasswordEditClass extends Component {
	constructor(props) {
		super(props)
		// this.submit = this.submit.bind(this)
		this.props.getPasswordReset(props.match.params.id);
		this.submit = this.submit.bind(this);
	}

	submit(values) {
		const { props } = this;
		if (values.password === values.repeat_password) {
			props.passwordUpdate(props.match.params.id, { password: values.password, email: props.passwordResetObj.user.email});
		}
		else {
			props.showNotification('mothership_admin.password.passwords_must_match', 'warning')
		}
	}

	render() {
		const { classes, passwordResetObj } = this.props
		const { user } = passwordResetObj || {} ;
		return (
			<div
				className={classes.main}
				// {...sanitizeRestProps(rest)}
			>
				<Card className={classes.card}>
					{/* <div className={classes.cardHeader}> */}
						<CardHeader title="Password Reset" subheader={user && user.email} />
					{/* </div> */}
					
		
					<SimpleForm redirect="/" record={passwordResetObj} save={this.submit} >
						<TextInput source="password" type="password"  />
            			<TextInput source="repeat_password" type="password" />
					</SimpleForm>
				</Card>
				<Notification />
			</div>
		);
	}
};

const mapStateToProps = state => {
	return ({ passwordResetObj: state.passwordResetObj })
}

export const PasswordEdit = withStyles(styles)(connect(mapStateToProps, {
	getPasswordReset,
	passwordReset,
	passwordUpdate,
	showNotification
})(PasswordEditClass));

