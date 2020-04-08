import React, { Children, cloneElement, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import {
	reduxForm,
	getFormAsyncErrors,
	getFormSyncErrors,
	getFormSubmitErrors,
} from "redux-form";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import { withStyles } from "@material-ui/core/styles";
import {
	getDefaultValues,
	REDUX_FORM_NAME,
	Toolbar
} from "react-admin";

const styles = (theme) => ({
	form: {
		[theme.breakpoints.up("sm")]: {
			padding: "0 1em 1em 1em",
		},
		[theme.breakpoints.down("xs")]: {
			padding: "0 1em 5em 1em",
		},
	},
	errorTabButton: { color: theme.palette.error.main },
});

const getTabFullPath = (tab, index, baseUrl) => {
	let url = baseUrl;

	if (index > 0) {
		url += tab.props.path ? `/${tab.props.path}` : `/${index}`;
	}

	return url;
};

export const TabbedForm = (props) => {
	const {
		children,
		className,
		classes = {},
		invalid,
		location,
		match,
		pristine,
		redirect,
		saving,
		submitOnEnter,
		tabsWithErrors,
		toolbar,
		version,
		tabNumber,
		tabPressed,
		handleSubmit,
		save
	} = props;

	const [tab, setTab] = useState();

	const handleChange = (newValue) => {
		setTab(newValue);
		// tell the parent
		if (tabPressed) {
			tabPressed(newValue);
		}
	};

	const handleSubmitWithRedirect = () => (
		handleSubmit((values) => save(values, redirect))
	);

	return (
		<form
			className={classnames("tabbed-form", className)}
			key={version}
		>
			<Tabs
				scrollable
				// The location pathname will contain the page path including the current tab path
				// so we can use it as a way to determine the current tab
				value={tabNumber === undefined ? tab : tabNumber}
				indicatorColor="primary"
				onChange={handleChange}
			>
				{Children.map(children, (thisTab, index) => {
					if (!thisTab) {
						return null;
					}

					// Builds the full tab tab which is the concatenation of the last matched route in the
					// TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
					// and the tab path.
					// This will be used as the Tab's value
					const tabPath = getTabFullPath(thisTab, index, match.url);

					return cloneElement(tab, {
						context: "header",
						value: index,
						className:
							tabsWithErrors.includes(thisTab.props.label)
							&& location.pathname !== tabPath
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
				{toolbar
					&& cloneElement(toolbar, {
						className: "toolbar",
						handleSubmitWithRedirect,
						handleSubmit,
						invalid,
						pristine,
						saving,
						submitOnEnter,
					})}
			</div>
		</form>
	);
};

TabbedForm.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	classes: PropTypes.objectOf(PropTypes.string),
	handleSubmit: PropTypes.func.isRequired, // passed by redux-form
	invalid: PropTypes.bool,
	location: PropTypes.shape({
		pathname: PropTypes.string
	}),
	match: PropTypes.objectOf(PropTypes.string),
	pristine: PropTypes.bool,
	redirect: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool,
		PropTypes.func,
	]),
	save: PropTypes.func.isRequired,
	saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	submitOnEnter: PropTypes.bool,
	tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
	toolbar: PropTypes.element,
	version: PropTypes.number,
};

TabbedForm.defaultProps = {
	submitOnEnter: true,
	toolbar: <Toolbar />,
	children: null,
	className: "",
	classes: null,
	invalid: false,
	location: null,
	match: null,
	pristine: false,
	redirect: null,
	saving: false,
	tabsWithErrors: [],
	version: 1
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

		if (inputs.some((input) => errors[input.props.source])) {
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
	reduxForm({
		destroyOnUnmount: false,
		enableReinitialize: true,
		keepDirtyOnReinitialize: true,
	}),
	withStyles(styles)
);

export default enhance(TabbedForm);
