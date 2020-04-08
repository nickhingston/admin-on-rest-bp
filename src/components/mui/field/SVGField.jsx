import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

const SVGField = ({ source, record = {}, elStyle }) => (
	// eslint-disable-next-line react/no-danger
	<div style={elStyle} dangerouslySetInnerHTML={{ __html: get(record, source) }} />
);

SVGField.defaultProps = {
	elStyle: null,
	record: null
};

SVGField.propTypes = {
	elStyle: PropTypes.shape({}),
	record: PropTypes.shape({}),
	source: PropTypes.string.isRequired,
};

export default SVGField;
