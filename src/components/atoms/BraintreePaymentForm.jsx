import React from "react";
import scriptLoader from "react-async-script-loader";


import braintree from "braintree-web";
import PropTypes from "prop-types";
import { Button, TextField, ButtonGroup } from "@material-ui/core";
import {
	SelectInput,
	SimpleForm
} from "react-admin";
import Alert from "components/atoms/Alert";
import countries from "common/countries.json";
import TableViewCell from "components/atoms/TableViewCell";

const apiUrl = process.env.REACT_APP_SERVICE_API;

class BraintreePaymentFormComponent extends React.Component {
	constructor(props) {
		super(props);

		const { user } = props;
		const { billingDetails } = user;
		const { billingAddress } = billingDetails || {};
		// The empty strings are needed to ensure the input is a controlled component.
		const email = (billingDetails && billingDetails.email) || user.email || "";
		const cardholderName = (billingDetails && billingDetails.cardholderName) || "";
		const phoneNumber = (billingDetails && billingDetails.phoneNumber) || user.telephone || "";
		const givenName = (billingAddress && billingAddress.givenName) || user.firstName || "";
		const surname = (billingAddress && billingAddress.surname) || user.lastName || "";
		const streetAddress = (billingAddress && billingAddress.streetAddress) || user.streetAddress1 || "";
		const extendedAddress = (
			billingAddress
			&& billingAddress.extendedAddress
		) || user.streetAddress2 || "";
		const locality = (billingAddress && billingAddress.locality) || user.city || "";
		const region = (billingAddress && billingAddress.region) || user.stateCounty || "";
		const postalCode = (billingAddress && billingAddress.postalCode) || user.postCode || "";
		const countryCodeAlpha2 = (billingAddress && billingAddress.countryCodeAlpha2)
			|| user.countryCode;
		this.state = {
			paymentOption: "paypal",
			email,
			cardholderName,
			givenName,
			surname,
			phoneNumber,
			streetAddress,
			extendedAddress,
			locality,
			region,
			postalCode,
			countryCodeAlpha2,
			alertProps: { open: false }
		};
		this.submitPressed = this.submitPressed.bind(this);
		this.handlePaymentMethod = this.handlePaymentMethod.bind(this);
		this.paypalButtonLoaded = false;
	}

	componentDidMount() {
		this.getToken();
	}

	componentDidUpdate() {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props;
		const { paypalCheckout } = this.state;

		if (!this.paypalButtonLoaded && isScriptLoaded) {
			if (isScriptLoadSucceed) {
				if (paypalCheckout) {
					this.setupPaypalButton();
				}
			}
			else {
				this.presentDialog("Error", "Could not load Paypal", true);
			}
		}
	}

	setupCardComponents = async (clientToken) => {
		const hostedFields = await braintree.hostedFields.create({
			authorization: clientToken,
			styles: {
				input: {
					"font-size": "16px",
					"font-weight": "400",
					"line-height": "19px",
					height: "25px",
					padding: "27px 12px 10px"
				}
				// Can't get :focus to work!!! Arrhhhgg
			},
			fields: {
				number: {
					selector: "#hf-number",
					placeholder: "XXXX XXXX XXXX XXXX"
				},
				cvv: {
					selector: "#hf-cvv",
					placeholder: "CVV"
				},
				expirationDate: {
					selector: "#hf-date",
					placeholder: "Expiry date MM/YY"
				}
				// postalCode: "#billing-postal-code"
			}
		});

		const threeDS = await braintree.threeDSecure.create({
			authorization: clientToken,
			version: 2
		});

		return {
			hostedFields,
			threeDS
		};
	}

	setupPaypalComponent = async (paypalClientToken) => {
		// set up listeners after initialization?
		// Create a client.
		let paypalCheckout = null;
		try {
			// PAYPAL
			const clientInstance = await braintree.client.create({
				authorization: paypalClientToken
			});

			paypalCheckout = await braintree.paypalCheckout.create({
				client: clientInstance
			});
		}
		catch (e) {
			console.error("could not setup paypal", e);
		}
		return { paypalCheckout };
	}

	getToken = () => {
		const { isScriptLoadSucceed } = this.props;
		const headers = { "Content-Type": "application/json" };
		// const me = this;
		const options = {
			method: "GET",
			headers
		};

		// need to get 2 seperate tokens - one for card
		fetch(`${apiUrl}/subscription/token?access_token=${localStorage.token}`, options)
			.then(async (response) => {
				const json = await response.json();
				this.setState({ clientToken: json });
				const { hostedFields, threeDS } = await this.setupCardComponents(json);
				this.setState({ hostedFields, threeDS });
			});

		// one for Paypal
		fetch(`${apiUrl}/subscription/token?access_token=${localStorage.token}`, options)
			.then(async (response) => {
				const json = await response.json();
				const { paypalCheckout } = await this.setupPaypalComponent(json);
				this.setState({ paypalCheckout }, () => {
					if (paypalCheckout && isScriptLoadSucceed) {
						this.setupPaypalButton();
					}
				});
			});
	}

	setupPaypalButton = () => {
		const { paypalCheckout } = this.state;
		const { isSandbox } = this.props;
		const { paypal } = window;
		const env = (isSandbox ? "sandbox" : "production");
		this.paypalButtonLoaded = true;
		// Set up PayPal with the checkout.js library
		return paypal.Button.render({
			env,
			style: {
				size: "responsive",
				shape: "pill"
			},
			payment: () => {
				this.setState({ requestingPayment: true });
				return paypalCheckout.createPayment({
					flow: "vault",
					billingAgreementDescription: "Subscription to vPOP PRO",
					enableShippingAddress: false
				});
			},

			onAuthorize: (data) => paypalCheckout.tokenizePayment(data)
				.then((payload) => {
					// Submit `payload.nonce` to your server.
					this.handlePaymentMethod(payload);
				}),

			onCancel: (data) => {
				this.setState({ requestingPayment: false });
				console.log("checkout.js payment cancelled", JSON.stringify(data, 0, 2));
			},

			onError: (err) => {
				this.setState({ requestingPayment: false });
				console.error("checkout.js error", err);
			}
		}, "#paypal-button-container");
	}

	closeDialog = () => {
		this.setState({
			alertProps: { open: false }
		});
	}

	presentDialog = (title, body, okOnly) => {
		const alertProps = {
			open: true,
			title,
			body,
			closeAction: this.closeDialog,
			okOnly
		};

		this.setState({
			alertProps
		});
	}

	handlePaymentMethod = (payload) => {
		const {
			email,
			cardholderName,
			// billing address fields
			givenName,
			surname,
			phoneNumber,
			streetAddress,
			extendedAddress,
			locality,
			region,
			postalCode,
			countryCodeAlpha2
		} = this.state;
		const billingAddress = {
			givenName,
			surname,
			phoneNumber,
			streetAddress,
			extendedAddress,
			locality,
			region,
			postalCode,
			countryCodeAlpha2
		};
		const { total, currency } = this.props;
		const headers = { "Content-Type": "application/json" };
		const options = {
			method: "POST",
			headers,
			body: JSON.stringify({
				payment_method_nonce: payload.nonce,
				amount: total,
				currency,
				billingDetails: {
					cardholderName,
					email,
					billingAddress
				}
			})
		};
		const { frequency, success } = this.props;
		fetch(`${apiUrl}/subscription?access_token=${localStorage.token}&frequency=${frequency}`, options)
			.then((response) => {
				if (response.ok) {
					success();
				}
				else {
					this.setState({ requestingPayment: false });
					response.json()
						.then((json) => {
							let errorMessage = json.error || "Payment failed: unknown";
							if (errorMessage === "Do Not Honor") {
								errorMessage = "Not Authorised";
							}
							this.presentDialog("Error", errorMessage, true);
						})
						.catch(() => {
							const errorMessage = "Payment failed: network error?";
							this.presentDialog("Error", errorMessage, true);
						});
				}
			});
	}

	textChanged = (ev) => {
		const obj = ev.target;
		const newState = {};
		newState[obj.dataset.value] = obj.value;
		this.setState(newState);
	}

	submitPressed() {
		const { total } = this.props;
		const {
			hostedFields,
			threeDS,
			email,
			cardholderName,
			// billing address fields
			givenName,
			surname,
			phoneNumber,
			streetAddress,
			extendedAddress,
			locality,
			region,
			postalCode,
			countryCodeAlpha2
		} = this.state;
		const billingAddress = {
			givenName,
			surname,
			phoneNumber,
			streetAddress,
			extendedAddress,
			locality,
			region,
			postalCode,
			countryCodeAlpha2
		};
		this.setState({ requestingPayment: true });
		const me = this;
		hostedFields.tokenize({
			cardholderName
		}).then((payload) => threeDS.verifyCard({
			onLookupComplete: (data, next) => {
				next();
			},
			amount: total,
			nonce: payload.nonce,
			bin: payload.details.bin,
			email,
			billingAddress
		}).then((threeDSPayload) => {
			const { threeDSecureInfo } = threeDSPayload;
			if (threeDSecureInfo.liabilityShiftPossible && !threeDSecureInfo.liabilityShifted) {
				this.presentDialog("Error", "Could not authorise", true);
				me.setState({ requestingPayment: false });
				threeDS.cancelVerifyCard();
			}
			else {
				this.handlePaymentMethod(threeDSPayload);
			}
		})).catch((err) => {
			this.setState({ requestingPayment: false });
			if (err.code === "HOSTED_FIELDS_FIELDS_INVALID") {
				const keyToString = {
					number: "card number",
					cvv: "CVV",
					expirationDate: "expiry date"
				};
				const fields = err.details.invalidFieldKeys.map((key) => (keyToString[key]));
				this.presentDialog("Error", `The following field are invalid:\n${fields}`, true);
			}
			else {
				this.presentDialog("Error", err.message, true);
			}
		});
	}

	render() {
		const {
			clientToken,
			requestingPayment,
			paymentOption,
			email,
			cardholderName,
			// billing address fields
			givenName,
			surname,
			phoneNumber,
			streetAddress,
			extendedAddress,
			locality,
			region,
			postalCode,
			countryCodeAlpha2,
			alertProps
		} = this.state;

		return (
			<>
				<SimpleForm toolbar={null} className={`braintree-container${requestingPayment ? " disabled" : ""}`}>
					<TableViewCell
						caption="Payment options"
						border={0}
						body={(
							<ButtonGroup fullWidth>
								<Button
									onClick={() => this.setState({ paymentOption: "paypal" })}
									variant={paymentOption === "paypal" ? "contained" : "outlined"}
									color="primary"
								>
									PayPal
								</Button>
								<Button
									onClick={() => this.setState({ paymentOption: "card" })}
									variant={paymentOption === "card" ? "contained" : "outlined"}
									color="primary"
								>
									Credit Card
								</Button>
							</ButtonGroup>
						)}
					/>

					<br />
					{ clientToken && (
						<>
							<div style={{ display: paymentOption === "paypal" ? "block" : "none" }}>
								<TableViewCell border={0}>
									<div align="center">
										<div id="paypal-button-container" style={{ width: "65%" }} />
									</div>
								</TableViewCell>
							</div>

							<div style={{ display: paymentOption === "card" ? "block" : "none" }}>
								<TableViewCell caption="Card details" border={0}>
									<TextField value={cardholderName} inputProps={{ "data-value": "cardholderName" }} className="form-control" id="billing-given-name" variant="filled" label="Name on card" onChange={this.textChanged} />
									<span className="input-group-addon"><span className="glyphicon glyphicon-credit-card" /></span>
									{/* braintree replaces these DIVs with inputs -
									style with class name - this class is then applied... */}
									<div className="MuiInputBase-root MuiFilledInput-root MuiFilledInput-underline">
										<div id="hf-number" className="form-control input-like-div noPadding" style={{ height: "50px" }} />
									</div>
									<span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
									<div className="MuiInputBase-root MuiFilledInput-root MuiFilledInput-underline">
										<div id="hf-date" className="form-control input-like-div noPadding" style={{ height: "50px" }} />
									</div>
									<span className="input-group-addon"><span className="glyphicon glyphicon-lock" /></span>
									<div className="MuiInputBase-root MuiFilledInput-root MuiFilledInput-underline">
										<div id="hf-cvv" className="form-control input-like-div noPadding" style={{ height: "50px" }} />
									</div>
								</TableViewCell>

								<TableViewCell caption="Name" border={0}>
									<TextField value={givenName} inputProps={{ "data-value": "givenName" }} className="form-control" id="billing-given-name" variant="filled" label="First name" onChange={this.textChanged} />
									<TextField value={surname} inputProps={{ "data-value": "surname" }} className="form-control" id="billing-surname" variant="filled" label="Last name" onChange={this.textChanged} />
								</TableViewCell>

								<TableViewCell caption="Email" border={0}>
									<TextField value={email} inputProps={{ "data-value": "email" }} type="email" className="form-control" id="email" variant="filled" label="Email" onChange={this.textChanged} />
								</TableViewCell>

								<TableViewCell caption="Phone number" border={0}>
									<TextField value={phoneNumber} inputProps={{ "data-value": "phoneNumber" }} type="tel" className="form-control" id="billing-phone" variant="filled" label="Phone number" onChange={this.textChanged} />
								</TableViewCell>

								<TableViewCell caption="Address" border={0}>
									<TextField value={streetAddress} inputProps={{ "data-value": "streetAddress" }} className="form-control" id="billing-street-address" variant="filled" label="Address" onChange={this.textChanged} />
									<TextField value={extendedAddress} inputProps={{ "data-value": "extendedAddress" }} className="form-control" id="billing-extended-address" variant="filled" label="Address" onChange={this.textChanged} />
									<TextField value={locality} inputProps={{ "data-value": "locality" }} className="form-control" id="billing-locality" variant="filled" label="Town / City" onChange={this.textChanged} />
									<TextField value={region} inputProps={{ "data-value": "region" }} className="form-control" id="billing-region" variant="filled" label="County / State / Region" onChange={this.textChanged} />
									<TextField value={postalCode} inputProps={{ "data-value": "postalCode" }} className="form-control" id="billing-postal-code" variant="filled" label="Zip / Postcode" onChange={this.textChanged} />
									<SelectInput
										id="billing-country-code"
										source="countries"
										choices={Object.values(countries)}
										optionText="title"
										optionValue="key"
										defaultValue={countryCodeAlpha2}
									/>
								</TableViewCell>

								<br />

								<TableViewCell
									border={0}
									icon={
										<Button variant="contained" color="primary" id="pay-btn" onClick={this.submitPressed}>Purchase now</Button>
									}
								/>
							</div>
						</>
					)}
				</SimpleForm>
				<Alert {...alertProps} />
			</>
		);
	}
}

// Not needed or used in minified mode
BraintreePaymentFormComponent.propTypes = {
	currency: PropTypes.string.isRequired,
	isScriptLoadSucceed: PropTypes.bool.isRequired,
	isScriptLoaded: PropTypes.bool.isRequired,
	isSandbox: PropTypes.bool,
	total: PropTypes.number.isRequired,
	frequency: PropTypes.string.isRequired,
	success: PropTypes.func.isRequired,
	user: PropTypes.shape({
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		email: PropTypes.string,
		telephone: PropTypes.string,
		streetAddress1: PropTypes.string,
		streetAddress2: PropTypes.string,
		city: PropTypes.string,
		stateCounty: PropTypes.string,
		postCode: PropTypes.string,
		countryCode: PropTypes.string,

		billingDetails: PropTypes.shape({
			cardholderName: PropTypes.string,
			email: PropTypes.string,
			phoneNumber: PropTypes.string,
			billingAddress: PropTypes.shape({
				givenName: PropTypes.string,
				surname: PropTypes.string,
				streetAddress: PropTypes.string,
				extendedAddress: PropTypes.string,
				locality: PropTypes.string,
				region: PropTypes.string,
				postalCode: PropTypes.string,
				countryCodeAlpha2: PropTypes.string
			})
		})

	}).isRequired
};

BraintreePaymentFormComponent.defaultProps = {
	isSandbox: false
};

const BraintreePaymentForm = BraintreePaymentFormComponent;

export default scriptLoader("https://www.paypalobjects.com/api/checkout.js")(BraintreePaymentForm);
