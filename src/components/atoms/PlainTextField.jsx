import React, { memo } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

const PlainTextField = ({ text, label }) => (
	<TextField
		label={label}
		defaultValue={text}
		key={text}
		InputProps={{ readOnly: true }}
		variant="filled"
	/>
);

PlainTextField.propTypes = {
	label: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

export default memo(PlainTextField);
