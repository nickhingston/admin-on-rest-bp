// copied from SimpleForm.js
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getDefaultValues from 'admin-on-rest/lib/mui/form/getDefaultValues';
import FormInput from 'admin-on-rest/lib/mui/form/FormInput';
import Toolbar from 'admin-on-rest/lib/mui/form/Toolbar';

const formStyle = { padding: '0 1em 1em 1em' };

export class SimpleFormWithButtons extends Component {
    handleSubmitWithRedirect = () => this.props.handleSubmit(values => this.props.save(values, "edit"));

    render() {
        const {
            basePath,
            children,
            // invalid,
            record,
            resource,
            // submitOnEnter,
            toolbar,
            version,
        } = this.props;
        return (
            <form className="simple-form">
                <div style={formStyle} key={version}>
                    {Children.map(children, input => input && (
                        <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
							{
                                (input.type.name === "FlatButton" && input) ||
                                (input.type.name === "TextField" && input) ||
                                <FormInput input={input} resource={resource} record={record} basePath={basePath} /> 
                            } 
                        </div>
                    ))}
                </div>
                {toolbar && React.cloneElement(toolbar, {
                    handleSubmitWithRedirect: this.handleSubmitWithRedirect
                })}
            </form>
        );
    }
}

SimpleFormWithButtons.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    validate: PropTypes.func,
    version: PropTypes.number,
};

SimpleFormWithButtons.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
);

export default enhance(SimpleFormWithButtons);
