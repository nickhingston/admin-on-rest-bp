import React, { memo } from "react";
import PropTypes from "prop-types";

const RecordButton = (props) => {
	const {
		style, record, records, label, onClick
	} = props;

	const handleClick = (e) => {
		onClick(record, records);
		e.stopPropagation();
		e.preventDefault();
	};

	return (
		<button
			type="button"
			style={style}
			onClick={handleClick}
		>
			{label}
		</button>
	);
};


RecordButton.propTypes = {
	style: PropTypes.objectOf(PropTypes.string),
	record: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		family: PropTypes.object,
		code: PropTypes.string,
		src: PropTypes.string,
		srcFront: PropTypes.string,
		srcBack: PropTypes.string,
		srcEnd: PropTypes.string
	}),
	onClick: PropTypes.func.isRequired
};

RecordButton.defaultProps = {
	style: {},
	record: {}
};

const PureRecordButton = memo(RecordButton);

export default PureRecordButton;
