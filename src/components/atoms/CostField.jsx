import React, { memo } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

const CostField = (props) => {
	const {
		record,
		plans,
		frequency
	} = props;

	if (!plans) {
		return null;
	}
	const planType = plans[frequency];
	if (!planType) {
		return null;
	}
	const planCost = planType.plan.price;
	const addOnCost = planType.addOn.amount;
	const cost = Math.round(
		(parseFloat(planCost) + (record.users.length - 1) * parseFloat(addOnCost)) * 100
	) / 100;

	// Having the key set to the cost forces the control to re-render when the cost changes.
	return (
		<TextField
			label="Cost"
			variant="filled"
			key={cost}
			defaultValue={`£${cost}`}
			InputProps={{ readOnly: true }}
		/>
	);
};

CostField.propTypes = {
	record: PropTypes.shape({
		users: PropTypes.array
	}).isRequired,
	plans: PropTypes.shape({
		plan: PropTypes.object,
		addOn: PropTypes.object
	}).isRequired,
	frequency: PropTypes.string.isRequired
};

export default memo(CostField);
