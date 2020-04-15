import React, { memo } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

const PaymentMethodField = ({ subscription }) => {
	const lastTransaction = subscription.transactions[0] || {};
	const creditCard = lastTransaction.creditCard && lastTransaction.creditCard.cardType && `${lastTransaction.creditCard.cardType} ${lastTransaction.creditCard.maskedNumber}  ${lastTransaction.creditCard.expirationMonth}/${lastTransaction.creditCard.expirationYear}`;
	const paymentMethod = creditCard || (subscription.paypalAccount && subscription.paypalAccount.length && "Paypal");
	return (
		<TextField
			label="Payment Method"
			defaultValue={paymentMethod}
			InputProps={{ readOnly: true }}
			variant="filled"
		/>
	);
};

PaymentMethodField.propTypes = {
	subscription: PropTypes.shape({
		transactions: PropTypes.array,
		paypalAccount: PropTypes.string
	}).isRequired
};

export default memo(PaymentMethodField);
