import { put, takeEvery } from 'redux-saga/effects';
import { showNotification, CREATE } from 'admin-on-rest';
import { push } from 'react-router-redux';

// register actions
export const REGISTER_USER = 'REGISTER_USER';
export const registerUser = (id, data, basePath) => ({
    type: REGISTER_USER,
    payload: { id, data: { ...data, is_approved: true } },
    meta: { resource: 'user', fetch: CREATE, cancelPrevious: false },
});

export const REGISTER_FAILED = 'REGISTER_FAILED';
export const registerFailed = (error) => ({
    type: REGISTER_FAILED,
    error: error.message,
    // meta: { resource: 'register', fetch: GET_ONE, cancelPrevious: false },
});

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const registerSuccess = () => ({
    type: REGISTER_SUCCESS,
});

function *handleRegistrationFailed({error}) {
    yield put(showNotification('Registration failed: ' + error , 'warning'))
}

function *handleRegistrationSucceeded() {
    yield put(showNotification('Registration success'));
    yield put(push('/'))
}

export default function *registerSaga() {
    yield takeEvery('REGISTER_FAILED', handleRegistrationFailed)
    yield takeEvery('REGISTER_SUCCESS', handleRegistrationSucceeded)
}

