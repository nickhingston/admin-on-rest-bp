import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const SVGField = ({ source, record = {}, elStyle }) => {
    return <div dangerouslySetInnerHTML={{__html:get(record, source)}} />;
}

SVGField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureSVGField = pure(SVGField);

PureSVGField.defaultProps = {
    addLabel: true,
};

export default PureSVGField;
