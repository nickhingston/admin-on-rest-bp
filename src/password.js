import React from 'react';
import { 
	Edit,
	SimpleForm,
	TextInput,
	ImageField,
	CREATE,
	showNotification
} from 'admin-on-rest';

import { put, takeEvery } from 'redux-saga/effects';

// action
export const PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST';
export const passwordReset = (token, data) => {
    return ({
        type: PASSWORD_RESET_REQUEST,
        payload: { access_token:token, data: { ...data}  },
        meta: { resource: 'password-resets', fetch: CREATE, cancelPrevious: false },
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

export const passwordSaga = function *passwordSaga() {
    yield takeEvery('PASSWORD_RESET_REQUEST_SUCCESS', handlePasswordResetRequestSuccess)
    yield takeEvery('PASSWORD_RESET_REQUEST_FAILURE', handlePasswordResetRequestFailure)
}

// ui
const UserEmail = ({ record }) => {
    return <span>{record.user.email}</span>;
}

export const PasswordEdit = (props) => {
	console.log('PasswordEdit:', props)
	return (
		<Edit title={<UserEmail />} {...props}>
			<SimpleForm redirect="/">	
				<ImageField source="user.picture" />
                <TextInput source="password" type="password"  />
                <TextInput source="repeat_password" type="password" />
			</SimpleForm>
	 	</Edit> 
	);
};

