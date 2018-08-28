import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';

const SVGField = ({ source, record = {}, elStyle }) => {
    return <div style={elStyle} dangerouslySetInnerHTML={{__html:get(record, source)}} />;
}

SVGField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

export default SVGField;
