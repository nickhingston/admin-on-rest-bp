import {
	showNotification, GET_ONE, UPDATE, DELETE, refreshView as refreshViewAction
} from "react-admin";
import { put, takeEvery, all } from "redux-saga/effects";

// reducers
export const subscriptionPlanReducer = (previousState = null, { type, payload }) => {
	if (type === "SUBSCRIPTION_GET_PLANS_REQUEST_SUCCESS") {
		return payload.data;
	}
	return previousState;
};

// subscription actions
export const SUBSCRIPTION_GET_PLANS_REQUEST = "SUBSCRIPTION_GET_PLANS_REQUEST";
export const subscriptionGetPlans = () => {
	const payload = { id: "plans" };
	return ({
		type: SUBSCRIPTION_GET_PLANS_REQUEST,
		payload,
		meta: { resource: "subscription", fetch: GET_ONE, cancelPrevious: false },
	});
};

export const SUBSCRIPTION_UPDATE_REQUEST = "SUBSCRIPTION_UPDATE_REQUEST";
export const subscriptionUpdate = (account, nonce) => {
	const payload = { id: account.id, data: { ...account } };
	if (nonce) {
		payload.payment_method_nonce = nonce;
	}
	return ({
		type: SUBSCRIPTION_UPDATE_REQUEST,
		payload,
		meta: { resource: "subscription", fetch: UPDATE, cancelPrevious: false },
	});
};


export const SUBSCRIPTION_DELETE_REQUEST = "SUBSCRIPTION_DELETE_REQUEST";
export const subscriptionDelete = (account) => ({
	type: SUBSCRIPTION_DELETE_REQUEST,
	payload: { id: account.id },
	meta: {
		resource: "subscription",
		fetch: DELETE,
		cancelPrevious: false,
		// onSuccess: {
		//     notification: {
		//         body: 'mothership_admin.subscription.delete_succeeded',
		//         level: 'info'
		//     },
		//     redirectTo: `/accounts/${account.id}`
		// }
	}
});

function* handleSubscriptionSuccess() {
	yield put(refreshViewAction());
	yield put(showNotification("mothership_admin.subscription.succeeded"));
}

function* handleSubscriptionFailed() {
	yield put(showNotification("mothership_admin.subscription.failed", "warning"));
}

function* handleSubscriptionDeleteSuccess() {
	yield put(refreshViewAction());
	yield put(showNotification("mothership_admin.subscription.delete_succeeded"));
}

function* handleSubscriptionDeleteFailed() {
	yield put(showNotification("mothership_admin.subscription.delete_failed", "warning"));
}


export default function* registerSaga() {
	yield all([
		yield takeEvery("SUBSCRIPTION_UPDATE_REQUEST_SUCCESS", handleSubscriptionSuccess),
		yield takeEvery("SUBSCRIPTION_UPDATE_REQUEST_FAILURE", handleSubscriptionFailed),
		yield takeEvery("SUBSCRIPTION_DELETE_REQUEST_SUCCESS", handleSubscriptionDeleteSuccess),
		yield takeEvery("SUBSCRIPTION_DELETE_REQUEST_FAILURE", handleSubscriptionDeleteFailed)
	]);
}
