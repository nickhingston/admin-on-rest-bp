import React, { memo } from "react";
import PropTypes from "prop-types";

const RecordButton = (props) => {
	const {
		elStyle, record, records, label, onClick
	} = props;

	const handleClick = (e) => {
		onClick(record, records);
		e.stopPropagation();
		e.preventDefault();
	};

	return (
		<button
			type="button"
			style={elStyle}
			onClick={handleClick}
		>
			{label}
		</button>
	);
};


RecordButton.propTypes = {
	elStyle: PropTypes.objectOf(PropTypes.string),
	record: PropTypes.objectOf(PropTypes.string),
	onClick: PropTypes.func.isRequired
};

RecordButton.defaultProps = {
	elStyle: {},
	record: {}
};

const PureRecordButton = memo(RecordButton);

export default PureRecordButton;
