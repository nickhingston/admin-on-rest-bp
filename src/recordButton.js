import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

class RecordButton extends Component {
	render() {
		const {elStyle, record, source, label, onClick} = this.props;
		const item = get(record, source);
		return <a style={elStyle} onClick={(e) => { onClick(item); e.stopPropagation(); e.preventDefault()}}>{label}</a>;
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