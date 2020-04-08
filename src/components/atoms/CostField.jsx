import React, { memo } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

const CostField = ({ record, plans, elStyle }) => {
	if (!plans) {
		return null;
	}
	const frequency = get(record, "frequency");
	const planType = plans[frequency];
	if (!planType) {
		return null;
	}
	const planCost = planType.plan.price;
	const addOnCost = planType.addOn.amount;
	return (
		<span style={elStyle}>
			£
			{parseFloat(planCost) + (record.users.length - 1) * parseFloat(addOnCost)}
		</span>
	);
};

CostField.propTypes = {
	elStyle: PropTypes.objectOf(PropTypes.string),
};

CostField.defaultProps = {
	elStyle: {},
};

export default memo(CostField);
