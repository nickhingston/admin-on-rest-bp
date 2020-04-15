import React from "react";
import PropTypes from "prop-types";
import countries from "common/countries.json";
import BraintreePaymentForm from "components/atoms/BraintreePaymentForm";

const BraintreeWrapper = (props) => {
	const {
		userData,
		frequency,
		plans,
		currency,
		success
	} = props;
	const {
		contactFirstName,
		contactLastName,
		contactEmail,
		contactAddress
	} = userData;

	const {
		streetAddress,
		locality,
		region,
		postalCode,
		countryName
	} = contactAddress;

	const countryDetails = countryName
		? Object.values(countries).find((value) => value.title === countryName)
		: null;
	const foundCountryCode = countryDetails ? countryDetails.key : "";

	const billingDetails = {
		cardholderName: `${contactFirstName} ${contactLastName}`,
		email: contactEmail,
		phoneNumber: "",
		billingAddress: {
			givenName: contactFirstName,
			surname: contactLastName,
			streetAddress,
			extendedAddress: "",
			locality,
			region,
			postalCode,
			countryCodeAlpha2: foundCountryCode
		}
	};

	const user = {
		firstName: contactFirstName,
		lastName: contactLastName,
		email: contactEmail,
		telephone: "",
		streetAddress1: streetAddress,
		streetAddress2: "",
		city: locality,
		stateCounty: region,
		postCode: postalCode,
		countryCode: foundCountryCode,
		billingDetails
	};

	const planType = plans[frequency];

	let total = "";

	if (planType) {
		const planCost = planType.plan.price;
		const addOnCost = planType.addOn.amount;
		total = Math.round(
			(parseFloat(planCost) + (userData.users.length - 1) * parseFloat(addOnCost)) * 100
		) / 100;
	}

	return (
		<BraintreePaymentForm
			user={user}
			frequency={frequency}
			total={total}
			currency={currency}
			success={success}
		/>
	);
};

BraintreeWrapper.propTypes = {
	userData: PropTypes.shape({
		contactFirstName: PropTypes.string.isRequired,
		contactLastName: PropTypes.string.isRequired,
		contactEmail: PropTypes.string.isRequired,
		contactAddress: PropTypes.shape({
			streetAddress: PropTypes.string.isRequired,
			locality: PropTypes.string.isRequired,
			region: PropTypes.string.isRequired,
			postalCode: PropTypes.string.isRequired,
			countryName: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	frequency: PropTypes.string.isRequired,
	plan: PropTypes.shape({
		id: PropTypes.string.isRequired,
		yearly: PropTypes.object.isRequired,
		monthly: PropTypes.object.isRequired
	}).isRequired,
	currency: PropTypes.string.isRequired,
	success: PropTypes.func.isRequired
};

export default BraintreeWrapper;
