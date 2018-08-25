import { UPDATE, DELETE } from 'admin-on-rest';

// register actions
export const SUBSCRIPTION_UPDATE_REQUEST = 'SUBSCRIPTION_UPDATE_REQUEST';
export const subscriptionUpdate = (account, nonce) => {
    let payload = { id: account.id, data: { ...account } };
    if (nonce) {
        payload.payment_method_nonce = nonce;
    }
    return ({
        type: SUBSCRIPTION_UPDATE_REQUEST,
		payload,
        meta: { resource: 'subscription', fetch: UPDATE, cancelPrevious: false },
    })
};


export const SUBSCRIPTION_DELETE_REQUEST = 'SUBSCRIPTION_DELETE_REQUEST';
export const subscriptionDelete = (account) => {
    return ({
        type: SUBSCRIPTION_DELETE_REQUEST,
		payload: { id: account.id },
        meta: { resource: 'subscription', fetch: DELETE, cancelPrevious: false },
    })
};