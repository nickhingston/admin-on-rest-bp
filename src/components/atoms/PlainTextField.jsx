import React, { memo } from "react";
import PropTypes from "prop-types";

const PlainTextField = ({ text, elStyle }) => <span style={elStyle}>{text}</span>;

PlainTextField.propTypes = {
	elStyle: PropTypes.objectOf(PropTypes.string),
	text: PropTypes.string.isRequired
};

PlainTextField.defaultProps = {
	elStyle: null
};

export default memo(PlainTextField);
