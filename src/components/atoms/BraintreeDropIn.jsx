import React, { useState } from "react";

import braintree from "braintree-web-drop-in";
import BraintreeDropin from "braintree-dropin-react";

import MuiFlatButton from "@material-ui/core/Button";

const apiUrl = process.env.REACT_APP_SERVICE_API;

const BraintreeDropInComponent = (props) => {
	const [clientToken, setToken] = useState(null);
	const [dropinInstance, setDropinInstance] = useState(null);

	const getToken = () => {
		const headers = { "Content-Type": "application/json" };

		const options = {
			method: "GET",
			headers
		};
		fetch(`${apiUrl}/subscription/token?access_token=${localStorage.token}`, options)
			.then((response) => {
				response.json().then((json) => {
					setToken(json);
				});
			});
	};

	if (!clientToken) {
		getToken();
	}

	const onCreate = (instance) => {
		setDropinInstance(instance);
	};

	const onDestroyStart = () => {};

	const onDestroyEnd = () => {};

	const onError = () => {
		setDropinInstance(null);
	};

	const handlePaymentMethod = (payload) => {
		const {
			success,
			record,
			failure,
		} = props;
		const headers = { "Content-Type": "application/json" };

		const options = {
			method: "PUT",
			headers,
			body: JSON.stringify({})
		};
		fetch(`${apiUrl}/subscription?access_token=${encodeURIComponent(localStorage.token)}&payment_method_nonce=${encodeURIComponent(payload.nonce)}&frequency=${record.frequency}`, options)
			.then((response) => {
				if (response.ok) {
					setDropinInstance(null);
					success();
				}
				else {
					setToken(null);
					getToken();
					response.json()
						.then((json) => {
							const errorMessage = json.error || "Payment failed: unknown";
							failure(Error(errorMessage));
						})
						.catch(() => {
							const errorMessage = "Payment failed: network error?";
							failure(Error(errorMessage));
						});
				}
			});
	};

	const renderSubmitButton = ({ onClick, isDisabled }) => {
		const { submitButtonText } = props;
		if (dropinInstance) {
			return (
				<MuiFlatButton
					color="primary"
					variant="contained"
					disabled={isDisabled}
					key="add-user-button"
					label="Set Payment Method"
					onClick={onClick}
				>
					{submitButtonText}
				</MuiFlatButton>
			);
		}
		return null;
	};

	return (
		<BraintreeDropin
			braintree={braintree}
			authorizationToken={clientToken}
			handlePaymentMethod={handlePaymentMethod}
			onCreate={onCreate}
			onDestroyStart={onDestroyStart}
			onDestroyEnd={onDestroyEnd}
			onError={onError}
			renderSubmitButton={renderSubmitButton}
			paypal={{
				flow: "vault"
			}}
		/>
	);
};

export default BraintreeDropInComponent;
