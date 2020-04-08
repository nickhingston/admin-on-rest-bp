import React, { memo } from "react";
import PropTypes from "prop-types";

const PaymentMethodField = ({ subscription, elStyle }) => {
	const lastTransaction = subscription.transactions[0] || {};
	const creditCard = lastTransaction.creditCard && lastTransaction.creditCard.cardType && `${lastTransaction.creditCard.cardType} ${lastTransaction.creditCard.maskedNumber}  ${lastTransaction.creditCard.expirationMonth}/${lastTransaction.creditCard.expirationYear}`;
	const paymentMethod = creditCard || (subscription.paypalAccount && subscription.paypalAccount.length && "Paypal");
	return <span style={elStyle}>{paymentMethod}</span>;
};

PaymentMethodField.propTypes = {
	elStyle: PropTypes.objectOf(PropTypes.string),
	subscription: PropTypes.shape({
		transactions: PropTypes.array,
		paypalAccount: PropTypes.string
	}).isRequired
};

PaymentMethodField.defaultProps = {
	elStyle: {}
};

export default memo(PaymentMethodField);
