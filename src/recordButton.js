import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

class RecordButton extends Component {
	render() {
		const {elStyle, record, records, label, onClick} = this.props;
		return <a style={elStyle} onClick={(e) => { onClick(record, records); e.stopPropagation(); e.preventDefault()}}>{label}</a>;
	}
}


RecordButton.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
	source: PropTypes.string.isRequired,
	parentRecord: PropTypes.object,
	onClick: PropTypes.func
};

const PureRecordButton = pure(RecordButton);

PureRecordButton.defaultProps = {
    addLabel: true,
};

export default RecordButton;