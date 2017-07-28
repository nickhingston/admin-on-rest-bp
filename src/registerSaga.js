import { put, takeEvery } from 'redux-saga/effects';
import { showNotification, CREATE, GET_ONE } from 'admin-on-rest';
import { push } from 'react-router-redux';



// reducers

export const registerGetReducer = (previousState = null, { type, payload }) => {
    if (type === 'REGISTER_GET_REQUEST_SUCCESS') {
        return payload.data;
    }
    return previousState;
}
// register actions
export const REGISTER_GET_REQUEST = 'REGISTER_GET_REQUEST';
export const registerGet = (id, data, basePath) => {
    return ({
        type: REGISTER_GET_REQUEST,
        payload: { id, data: { ...data}  },
        meta: { resource: 'register', fetch: GET_ONE, cancelPrevious: false },
    })
};

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const registerUser = (data, regToken) => {
    return ({
        type: REGISTER_USER_REQUEST,
        payload:  { access_token:regToken, data },
        meta: { resource: 'users', fetch: CREATE, cancelPrevious: false },
    })
};

// saga
function *handleRegisterGetSuccess(bah) {
    console.log(bah)
     yield put(showNotification('handleRegisterGetSuccess'))
}

function *handleRegisterGetFailed(bah) {
    console.log(bah)
     yield put(showNotification('handleRegisterGetFailed'))
}

function *handleRegistrationFailed({error}) {
    yield put(showNotification('Registration failed: ' + error , 'warning'))
}

function *handleRegistrationSucceeded() {
    yield put(showNotification('Registration success'));
    yield put(push('/'))
}

export default function *registerSaga() {
    yield takeEvery('REGISTER_GET_REQUEST_SUCCESS', handleRegisterGetSuccess)
    yield takeEvery('REGISTER_GET_REQUEST_FAILURE', handleRegisterGetFailed)
    yield takeEvery('REGISTER_USER_REQUEST_SUCCESS', handleRegistrationSucceeded)
    yield takeEvery('REGISTER_USER_REQUEST_FAILURE', handleRegistrationFailed)
}

