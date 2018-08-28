import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
    reduxForm,
    getFormAsyncErrors,
    getFormSyncErrors,
    getFormSubmitErrors,
} from 'redux-form';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import compose from 'recompose/compose';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from '@material-ui/core/styles';
import { getDefaultValues, translate, REDUX_FORM_NAME } from 'ra-core';

import { Toolbar } from 'react-admin';

const styles = theme => ({
    form: {
        [theme.breakpoints.up('sm')]: {
            padding: '0 1em 1em 1em',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '0 1em 5em 1em',
        },
    },
    errorTabButton: { color: theme.palette.error.main },
});

const sanitizeRestProps = ({
    anyTouched,
    array,
    asyncBlurFields,
    asyncValidate,
    asyncValidating,
    autofill,
    blur,
    change,
    clearAsyncError,
    clearFields,
    clearSubmit,
    clearSubmitErrors,
    destroy,
    dirty,
    dispatch,
    form,
    handleSubmit,
    initialize,
    initialized,
    initialValues,
    pristine,
    pure,
    redirect,
    reset,
    resetSection,
    save,
    staticContext,
    submit,
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    translate,
    triggerSubmit,
    untouch,
    valid,
    validate,
    ...props
}) => props;

const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${
        tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''
    }`;

export class TabbedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
        this.handleChange = this.handleChange.bind(this);   
    }

    handleChange = (value) => {
        this.setState({ value });
        // tell the parent 
        if (this.props.tabPressed) {
            this.props.tabPressed(value);
        }
    }

    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        this.props.handleSubmit(values => this.props.save(values, redirect));

    render() {
        const {
            basePath,
            children,
            className,
            classes = {},
            invalid,
            location,
            match,
            pristine,
            record,
            redirect,
            resource,
            saving,
            submitOnEnter,
            tabsWithErrors,
            toolbar,
            translate,
            value,
            version,
            tabNumber,
            ...rest
        } = this.props;

        const validTabPaths = Children.toArray(children).map((tab, index) =>
            getTabFullPath(tab, index, match.url)
        );

        // This ensure we don't get warnings from material-ui Tabs component when
        // the current location pathname targets a dynamically added Tab
        // In the case the targeted Tab is not present at first render (when
        // using permissions for example) we temporarily switch to the first
        // available tab. The current location will be applied again on the
        // first render containing the targeted tab. This is almost transparent
        // for the user who may just see an short tab selection animation
        const tabsValue = validTabPaths.includes(location.pathname)
            ? location.pathname
            : validTabPaths[0];

        return (
            <form
                className={classnames('tabbed-form', className)}
                key={version}
                {...sanitizeRestProps(rest)}
            >
                <Tabs
                    scrollable
                    // The location pathname will contain the page path including the current tab path
                    // so we can use it as a way to determine the current tab
                    value={tabNumber === undefined?self.state.value:tabNumber}
                    indicatorColor="primary"
                    onChange={this.handleChange}
                >
                    {Children.map(children, (tab, index) => {
                        if (!tab) return null;

                        // Builds the full tab tab which is the concatenation of the last matched route in the
                        // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                        // and the tab path.
                        // This will be used as the Tab's value
                        const tabPath = getTabFullPath(tab, index, match.url);

                        return React.cloneElement(tab, {
                            context: 'header',
                            value: index,
                            className:
                                tabsWithErrors.includes(tab.props.label) &&
                                location.pathname !== tabPath
                                    ? classes.errorTabButton
                                    : null,
                        });
                    })}
                </Tabs>
                <Divider />
                <div className={classes.form}>
                    {/* All tabs are rendered (not only the one in focus), to allow validation
                    on tabs not in focus. The tabs receive a `hidden` property, which they'll
                    use to hide the tab using CSS if it's not the one in focus.
                    See https://github.com/marmelab/react-admin/issues/1866 */}
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab
                            //  && (
                                // <Route
                                //     exact
                                //     path={getTabFullPath(tab, index, match.url)}
                                // >
                                //     {routeProps =>
                                //         React.cloneElement(tab, {
                                //             context: 'content',
                                //             resource,
                                //             record,
                                //             basePath,
                                //             hidden: !routeProps.match,
                                //             /**
                                //              * Force redraw when the tab becomes active
                                //              *
                                //              * This is because the fields, decorated by redux-form and connect,
                                //              * aren't redrawn by default when the tab becomes active.
                                //              * Unfortunately, some material-ui fields (like multiline TextField)
                                //              * compute their size based on the scrollHeight of a dummy DOM element,
                                //              * and scrollHeight is 0 in a hidden div. So they must be redrawn
                                //              * once the tab becomes active.
                                //              *
                                //              * @ref https://github.com/marmelab/react-admin/issues/1956
                                //              */
                                //             key: `${index}_${!routeProps.match}`,
                                //         })
                                //     }
                                // </Route>
                            // )
                    )}
                    {toolbar &&
                        React.cloneElement(toolbar, {
                            className: 'toolbar',
                            handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                            handleSubmit: this.props.handleSubmit,
                            invalid,
                            pristine,
                            // redirect,
                            saving,
                            submitOnEnter,
                        })}
                </div>
            </form>
        );
    }
}

TabbedForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    classes: PropTypes.object,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    location: PropTypes.object,
    match: PropTypes.object,
    pristine: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    submitOnEnter: PropTypes.bool,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    validate: PropTypes.func,
    value: PropTypes.number,
    version: PropTypes.number,
};

TabbedForm.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const collectErrors = (state, props) => {
    const syncErrors = getFormSyncErrors(props.form)(state);
    const asyncErrors = getFormAsyncErrors(props.form)(state);
    const submitErrors = getFormSubmitErrors(props.form)(state);

    return {
        ...syncErrors,
        ...asyncErrors,
        ...submitErrors,
    };
};

export const findTabsWithErrors = (
    state,
    props,
    collectErrorsImpl = collectErrors
) => {
    const errors = collectErrorsImpl(state, props);

    return Children.toArray(props.children).reduce((acc, child) => {
        const inputs = Children.toArray(child.props.children);

        if (inputs.some(input => errors[input.props.source])) {
            return [...acc, child.props.label];
        }

        return acc;
    }, []);
};

const enhance = compose(
    withRouter,
    connect((state, props) => {
        const children = Children.toArray(props.children).reduce(
            (acc, child) => [...acc, ...Children.toArray(child.props.children)],
            []
        );

        return {
            form: props.form || REDUX_FORM_NAME,
            initialValues: getDefaultValues(state, { ...props, children }),
            saving: props.saving || state.admin.saving,
            tabsWithErrors: findTabsWithErrors(state, {
                form: REDUX_FORM_NAME,
                ...props,
            }),
        };
    }),
    translate, // Must be before reduxForm so that it can be used in validation
    reduxForm({
        destroyOnUnmount: false,
        enableReinitialize: true,
        keepDirtyOnReinitialize: true,
    }),
    withStyles(styles)
);

export default enhance(TabbedForm);


// import React, { Children, Component } from 'react';
// import PropTypes from 'prop-types';
// import { reduxForm } from 'redux-form';
// import { connect } from 'react-redux';
// import compose from 'recompose/compose';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';

// import { Toolbar } from 'react-admin';
// import { getDefaultValues } from 'ra-core';

// const formStyle = { padding: '0 1em 1em 1em' };

// export class TabbedForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: 0,
//         };
//         this.handleChange = this.handleChange.bind(this);   
//     }

//     handleChange = (value) => {
//         this.setState({ value });
//         // tell the parent 
//         if (this.props.tabPressed) {
//             this.props.tabPressed(value);
//         }
//     };

//     handleSubmitWithRedirect = (redirect = this.props.redirect) => this.props.handleSubmit(values => this.props.save(values, redirect));

//     render() {
//         const { children, contentContainerStyle, invalid, record, resource, basePath, translate, submitOnEnter, toolbar, tabNumber } = this.props;
//         return (
//             <form className="tabbed-form">
//                 <div style={formStyle}>
//                     <Tabs
//                         value={tabNumber === undefined?self.state.value:tabNumber}
//                         onChange={this.handleChange}
//                         contentContainerStyle={contentContainerStyle}
//                     >
//                         {React.Children.map(children, (tab, index) =>
//                             <Tab
//                                 key={tab.props.value}
//                                 className="form-tab"
//                                 label={translate(tab.props.label, { _: tab.props.label })}
//                                 value={index}
//                                 icon={tab.props.icon}
//                             >
//                                 {React.cloneElement(tab, { resource, record, basePath })}
//                             </Tab>,
//                         )}
//                     </Tabs>
//                 </div>
                        
//                  {toolbar && React.cloneElement(toolbar, {
//                     handleSubmitWithRedirect: this.handleSubmitWithRedirect,
//                     invalid,
//                     submitOnEnter,
//                 })} 
//             </form>
//         );
//     }
// }

// TabbedForm.propTypes = {
//     basePath: PropTypes.string,
//     children: PropTypes.node,
//     contentContainerStyle: PropTypes.object,
//     defaultValue: PropTypes.oneOfType([
//         PropTypes.object,
//         PropTypes.func,
//     ]),
//     handleSubmit: PropTypes.func, // passed by redux-form
//     invalid: PropTypes.bool,
//     record: PropTypes.object,
//     redirect: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.bool,
//     ]),
//     resource: PropTypes.string,
//     save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
//     submitOnEnter: PropTypes.bool,
//     toolbar: PropTypes.element,
//     translate: PropTypes.func,
//     validate: PropTypes.func,
//     tabPressed: PropTypes.func,
//     tabNumber: PropTypes.number
// };

// TabbedForm.defaultProps = {
//     contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
//     submitOnEnter: true,
//     toolbar: <Toolbar />,
//     tabNumber:0
// };

// const enhance = compose(
//     connect((state, props) => {
//         const children = Children.toArray(props.children).reduce((acc, child) => [
//             ...acc,
//             ...Children.toArray(child.props.children),
//         ], []);

//         return {
//             initialValues: getDefaultValues(state, { ...props, children }),
//         };
//     }),
//     reduxForm({
//         form: 'record-form',
//         enableReinitialize: true,
//     }),
// );

// export default enhance(TabbedForm);
