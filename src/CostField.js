import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const CostField = ({ record, plans, elStyle }) => {
	if (!plans) return null;
	const frequency = get(record, "frequency");
	const planCost = plans[frequency].plan.price;
	const addOnCost = plans[frequency].addOn.amount;
    return <span style={elStyle}>£{parseFloat(planCost) + (record.users.length - 1) * parseFloat(addOnCost)}</span>;
}

CostField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
};

const PureCostField = pure(CostField);

PureCostField.defaultProps = {
    addLabel: true,
};

export default PureCostField;