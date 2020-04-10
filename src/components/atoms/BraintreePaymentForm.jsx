import React from "react";
import { connect } from "react-redux";
import scriptLoader from "react-async-script-loader";


import braintree from "braintree-web";
import PropTypes from "prop-types";
import { Button, Card } from "@material-ui/core";
import {
	TextInput,
	SelectArrayInput,
	TabbedForm,
	FormTab
} from "react-admin";
import countries from "common/countries.json";

const apiUrl = process.env.REACT_APP_SERVICE_API;

class BraintreePaymentFormComponent extends React.Component {
	constructor(props) {
		super(props);

		const { user } = props;
		const { billingDetails } = user;
		const { billingAddress } = billingDetails || {};
		const email = (billingDetails && billingDetails.email) || user.email;
		const cardholderName = (billingDetails && billingDetails.cardholderName);
		const phoneNumber = (billingDetails && billingDetails.phoneNumber) || user.telephone;
		const givenName = (billingAddress && billingAddress.givenName) || user.firstName;
		const surname = (billingAddress && billingAddress.surname) || user.lastName;
		const streetAddress = (billingAddress && billingAddress.streetAddress) || user.streetAddress1;
		const extendedAddress = (
			billingAddress
			&& billingAddress.extendedAddress
		) || user.streetAddress2;
		const locality = (billingAddress && billingAddress.locality) || user.city;
		const region = (billingAddress && billingAddress.region) || user.stateCounty;
		const postalCode = (billingAddress && billingAddress.postalCode) || user.postCode;
		const countryCodeAlpha2 = (billingAddress && billingAddress.countryCodeAlpha2) || user.countryCode || "US";
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
			countryCodeAlpha2
		};
		this.submitPressed = this.submitPressed.bind(this);
		this.handlePaymentMethod = this.handlePaymentMethod.bind(this);
	}

	componentDidMount() {
		this.getToken();
	}

	componentDidUpdate(prevProps) {
		const { isScriptLoaded, isScriptLoadSucceed, uiActions } = this.props;
		const { paypalCheckout } = this.state;
		if (!prevProps.isScriptLoaded && isScriptLoaded) {
			if (isScriptLoadSucceed) {
				if (paypalCheckout) {
					this.setupPaypalButton();
				}
			}
			else {
				uiActions.presentDialog(infoDialog("Error", "Could not load Paypal"));
			}
		}
	}

	setupCardComponents = async (clientToken) => {
		const hostedFields = await braintree.hostedFields.create({
			authorization: clientToken,
			styles: {
				input: {
					"font-size": "15px",
					height: "51px",
					padding: "16px"
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
					placeholder: "Expirary date MM/YY"
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

	setupPaypalButton() {
		const { paypalCheckout } = this.state;
		const { isSandbox } = this.props;
		const { paypal } = window;
		const me = this;
		const env = (isSandbox ? "sandbox" : "production");
		// Set up PayPal with the checkout.js library
		return paypal.Button.render({
			env,
			style: {
				size: "responsive",
				shape: "pill"
			},
			payment: () => {
				me.setState({ requestingPayment: true });
				return paypalCheckout.createPayment({
					flow: "vault",
					billingAgreementDescription: "Subscription to vPOP PRO",
					enableShippingAddress: false
				});
			},

			onAuthorize: (data) => paypalCheckout.tokenizePayment(data)
				.then((payload) => {
					// Submit `payload.nonce` to your server.
					me.handlePaymentMethod(payload);
				}),

			onCancel: (data) => {
				me.setState({ requestingPayment: false });
				console.log("checkout.js payment cancelled", JSON.stringify(data, 0, 2));
			},

			onError: (err) => {
				me.setState({ requestingPayment: false });
				console.error("checkout.js error", err);
			}
		}, "#paypal-button-container");
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
		const { frequency, uiActions, success } = this.props;
		fetch(`${apiUrl}/subscription?access_token=${localStorage.token}&frequency=${frequency}`, options)
			.then((response) => {
				if (response.ok) {
					success();
				}
				else {
					this.setState({ requestingPayment: false });
					response.json()
						.then((json) => {
							console.log(json);
							let errorMessage = json.error || "Payment failed: unknown";
							if (errorMessage === "Do Not Honor") {
								errorMessage = "Not Authorised";
							}
							uiActions.presentDialog(infoDialog("Error", errorMessage));
							console.log(response);
						})
						.catch(() => {
							const errorMessage = "Payment failed: network error?";
							uiActions.presentDialog(infoDialog("Error", errorMessage));
							console.log(response);
						});
				}
			});
	}

	submitPressed() {
		const { total, uiActions } = this.props;
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
				uiActions.presentDialog(infoDialog("Error", "Could not authorise"));
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
				uiActions.presentDialog(infoDialog("Error", `The following field are invalid:\n${fields}`));
			}
			else {
				uiActions.presentDialog(infoDialog("Error", err.message));
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
			countryCodeAlpha2

		} = this.state;


		return (
			<TabbedForm>

				<FormTab label="PayPal">
					<div id="paypal-button-container" style={{ width: "65%" }} />
				</FormTab>

				<FormTab label="Card">
					<Card caption="Card details" border={0}>
						<TextInput className="form-control" id="billing-given-name" placeholder="Name on card" textChanged={(text) => this.setState({ cardholderName: text })} text={cardholderName} />
						<span className="input-group-addon"><span className="glyphicon glyphicon-credit-card" /></span>
						{/* braintree replaces these DIVs with inputs -
						style with class name - this class is then applied... */}
						<div id="hf-number" className="form-control input-like-div noPadding" />
						<span className="input-group-addon"><span className="glyphicon glyphicon-calendar" /></span>
						<div id="hf-date" className="form-control input-like-div noPadding" />
						<span className="input-group-addon"><span className="glyphicon glyphicon-lock" /></span>
						<div id="hf-cvv" className="form-control input-like-div noPadding" />
					</TableViewCell>

					<TableViewCell caption="Name" border={0}>
						<TextInput className="form-control" id="billing-given-name" placeholder="First name" textChanged={(text) => this.setState({ givenName: text })} text={givenName} />
						<TextInput className="form-control" id="billing-surname" placeholder="Last name" textChanged={(text) => this.setState({ surname: text })} text={surname} />
					</TableViewCell>

					<TableViewCell caption="Email" border={0}>
						<TextInput type="email" className="form-control" id="email" placeholder="Email" textChanged={(text) => this.setState({ email: text })} text={email} />
					</TableViewCell>

					<TableViewCell caption="Phone number" border={0}>
						<TextInput type="tel" className="form-control" id="billing-phone" placeholder="Phone number" textChanged={(text) => this.setState({ phoneNumber: text })} text={phoneNumber} />
					</TableViewCell>

					<TableViewCell caption="Address" border={0}>
						<TextInput className="form-control" id="billing-street-address" placeholder="Address" textChanged={(text) => this.setState({ streetAddress: text })} text={streetAddress} />
						<TextInput className="form-control" id="billing-extended-address" placeholder="Address" textChanged={(text) => this.setState({ extendedAddress: text })} text={extendedAddress} />
						<TextInput className="form-control" id="billing-locality" placeholder="Town / City" textChanged={(text) => this.setState({ locality: text })} text={locality} />
						<TextInput className="form-control" id="billing-region" placeholder="County / State / Region" textChanged={(text) => this.setState({ region: text })} text={region} />
						<TextInput className="form-control" id="billing-postal-code" placeholder="Zip / Postcode" textChanged={(text) => this.setState({ postalCode: text })} text={postalCode} />
						<SelectArrayInput
							id="billing-country-code"
							choices={countries}
							optionText={(record) => record.title}
							defaultValue={countryCodeAlpha2}
						/>
					</TableViewCell>

					<br />

					<TableViewCell
						border={0}
						icon={
							<Button fluid action id="pay-btn" onClick={this.submitPressed}>Purchase now</Button>
						}
					/>
				</FormTab>
			</TabbedForm>
		);
	}
}

// Not needed or used in minified mode
BraintreePaymentFormComponent.propTypes = {
	currency: PropTypes.string.isRequired,
	isScriptLoadSucceed: PropTypes.bool.isRequired,
	isScriptLoaded: PropTypes.bool.isRequired,
	isSandbox: PropTypes.bool,
	total: PropTypes.string.isRequired,
	frequency: PropTypes.string.isRequired,
	success: PropTypes.func.isRequired,
	uiActions: PropTypes.shape({
		presentDialog: PropTypes.func.isRequired,
		dismissModal: PropTypes.func.isRequired
	}).isRequired,
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

const BraintreePaymentForm = connect(null, null)(BraintreePaymentFormComponent);

export default scriptLoader("https://www.paypalobjects.com/api/checkout.js")(BraintreePaymentForm);
