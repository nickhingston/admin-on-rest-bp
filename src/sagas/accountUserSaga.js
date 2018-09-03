import { put, takeEvery, all } from 'redux-saga/effects';
import { UPDATE, showNotification } from 'react-admin';
// import { push } from 'react-router-redux';

// TODO: should this just be an action?


// reducers
// export const accountAddUser = (previousState = null, { type, payload }) => {
//     if (type === 'REGISTER_GET_REQUEST_SUCCESS') {
//         return payload.data;
//     }
//     return previousState;
// }


// register actions
export const ACCOUNT_ADD_USER_REQUEST = 'ACCOUNT_ADD_USER_REQUEST';
export const accountAddUser = (account, email) => {
    return ({
        type: ACCOUNT_ADD_USER_REQUEST,
		payload: { id: account.id, data: { ...account }, adduser: email },
        meta: { resource: 'accounts', fetch: UPDATE, cancelPrevious: false },
    })
};

// saga

function *handleAddUserFailure(response) {
     yield put(showNotification(response.error, 'warning'))
}

// function *handleRegisterFailed1(data) {
//     console.log(data)
//     if (data.error === 'Forbidden') {
//         yield put(showNotification('mothership_admin.register.already_registered', 'warning'))
//     }
//     else {
//         yield put(showNotification('mothership_admin.register.request_failed', 'warning'))
//     }
// }
    
// function *handleRegisterGetSuccess(bah) {
//     console.log(bah)
//      yield put(showNotification('handleRegisterGetSuccess'))
// }

// function *handleRegisterGetFailed(bah) {
//     console.log(bah)
//      yield put(showNotification('handleRegisterGetFailed'))
// }

// function *handleRegistrationFailed({error}) {
//     yield put(showNotification('Registration failed: ' + error , 'warning'))
// }

// function *handleRegistrationSucceeded() {
//     yield put(showNotification('Registration success'));
//     yield put(push('/'))
// }

export default function *accountUserSaga() {
     yield all([
        yield takeEvery('ACCOUNT_ADD_USER_REQUEST_FAILURE', handleAddUserFailure),
     ])
}
