import React from 'react';
import PropTypes from 'prop-types';
// import get from 'lodash.get';
import pure from 'recompose/pure';

const PlainTextField = ({ text, elStyle }) => {
    return <span style={elStyle}>{text}</span>;
}

PlainTextField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    text: PropTypes.string.isRequired
};

const PurePlainTextField = pure(PlainTextField);

PurePlainTextField.defaultProps = {
    addLabel: true,
};

export default PurePlainTextField;