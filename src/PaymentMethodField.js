import React from 'react';
import PropTypes from 'prop-types';
// import get from 'lodash.get';
import pure from 'recompose/pure';

const PaymentMethodField = ({ subscription, elStyle }) => {
    const lastTransaction = subscription.transactions[0] || {};
    const creditCard = lastTransaction.creditCard && lastTransaction.creditCard.cardType && `${lastTransaction.creditCard.cardType} ${lastTransaction.creditCard.maskedNumber}  ${lastTransaction.creditCard.expirationMonth}/${lastTransaction.creditCard.expirationYear}`
    const paymentMethod = creditCard || (subscription.paypalAccount && subscription.paypalAccount.length && "Paypal")
    return <span style={elStyle}>{paymentMethod}</span>;
}

PaymentMethodField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    subscription: PropTypes.object.isRequired
};

const PurePaymentMethodField = pure(PaymentMethodField);

PurePaymentMethodField.defaultProps = {
    addLabel: true,
};

export default PurePaymentMethodField;