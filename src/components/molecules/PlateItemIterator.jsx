// Based on ra-ui-materialui/src/form/SimpleFormIterator.js

import React, { Children, cloneElement } from "react";
import PropTypes from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { get } from "lodash";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/RemoveCircleOutline";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import classNames from "classnames";
import { useTranslate } from "react-admin";

const styles = (theme) => ({
	root: {
		padding: 0,
		marginBottom: 0,
		"& > li:last-child": {
			borderBottom: "none",
		},
	},
	line: {
		display: "flex",
		listStyleType: "none",
		// borderBottom: `solid 1px ${theme.palette.divider}`,
		[theme.breakpoints.down("xs")]: { display: "block" },
		"&.fade-enter": {
			opacity: 0.01,
			transform: "translateX(100vw)",
		},
		"&.fade-enter-active": {
			opacity: 1,
			transform: "translateX(0)",
			transition: "all 500ms ease-in",
		},
		"&.fade-exit": {
			opacity: 1,
			transform: "translateX(0)",
		},
		"&.fade-exit-active": {
			opacity: 0.01,
			transform: "translateX(100vw)",
			transition: "all 500ms ease-in",
		},
	},
	index: {
		width: "3em",
		paddingTop: "1em",
		[theme.breakpoints.down("sm")]: { display: "none" },
	},
	form: { flex: 2 },
	action: {
		paddingTop: "1.3em",
	},
	leftIcon: {
		marginRight: theme.spacing(1),
	},
});

const PlateItemIterator = (props) => {
	const {
		basePath,
		classes = {},
		children,
		fields,
		meta: { error, submitFailed },
		record,
		resource,
		source,
		disableAdd,
		disableRemove,
		defaultValue
	} = props;

	const translate = useTranslate();

	// we need a unique id for each field for a proper enter/exit animation
	// but redux-form doesn't provide one (cf https://github.com/erikras/redux-form/issues/2735)
	// so we keep an internal map between the field position and an autoincrement id
	let nextId = 0;

	if (defaultValue) {
		nextId = fields.length
			? fields.length
			: defaultValue.length;
	}

	// We check whether we have a defaultValue (which must be an array) before checking
	// the fields prop which will always be empty for a new record.
	// Without it, our ids wouldn't match the default value and we would get key warnings
	// on the CssTransition element inside our render method
	const ids = nextId > 0 ? Array.from(Array(nextId).keys()) : [];

	const removeField = (index) => () => {
		ids.splice(index, 1);
		fields.remove(index);
	};

	const addField = () => {
		ids.push(nextId += 1);
		fields.push({});
	};

	const records = get(record, source);
	if (!fields || !records || !records.length) {
		return null;
	}

	while (ids.length < fields.length) {
		ids.push(nextId += 1);
	}
	return (
		<ul className={classes.root}>
			{submitFailed && error && <span>{error}</span>}
			<TransitionGroup>
				{fields.map((member, index) => (
					<CSSTransition
						key={ids[index]}
						timeout={500}
						classNames="fade"
					>
						<li className={classes.line}>
							{ Children.map(children, (input) => {
								const bp = input.props.basePath || basePath;
								const rec = (records && records[index]) || {};
								const src = input.props.source ? `${member}.${input.props.source}` : null;
								const newInput = cloneElement(input, {
									source: src,
									label: input.props.label || input.props.source,
									style: input.props.style,
									basePath: bp,
									record: rec,
									resource
								});
								return newInput;
							})}
							{!disableRemove && index > 0 && (
								<span className={classes.action}>
									<Button
										className={classNames(
											"button-remove",
											`button-remove-${source}-${index}`
										)}
										size="small"
										onClick={removeField(index)}
									>
										<CloseIcon
											className={classes.leftIcon}
										/>
										{translate("ra.action.remove")}
									</Button>
								</span>
							)}
						</li>
					</CSSTransition>
				))}
			</TransitionGroup>
			{!disableAdd && (
				<li className={classes.line}>
					<span className={classes.action}>
						<Button
							className={classNames(
								"button-add",
								`button-add-${source}`
							)}
							size="small"
							onClick={addField}
						>
							<AddIcon className={classes.leftIcon} />
							{translate("ra.action.add")}
						</Button>
					</span>
				</li>
			)}
		</ul>
	);
};

PlateItemIterator.defaultProps = {
	disableAdd: false,
	disableRemove: false,
	defaultValue: null,
	children: null,
	meta: null,
	record: null,
	source: "",
};

PlateItemIterator.propTypes = {
	defaultValue: PropTypes.oneOf([
		PropTypes.string,
		PropTypes.array
	]),
	children: PropTypes.node,
	classes: PropTypes.shape({
		leftIcon: PropTypes.string,
		action: PropTypes.string,
		line: PropTypes.string,
		root: PropTypes.string,
	}).isRequired,
	fields: PropTypes.shape({
		value: PropTypes.array
	}).isRequired,
	meta: PropTypes.shape({
		error: PropTypes.string,
		submitFailed: PropTypes.bool
	}),
	record: PropTypes.shape({}),
	source: PropTypes.string,
	disableAdd: PropTypes.bool,
	disableRemove: PropTypes.bool,
};

export default withStyles(styles)(PlateItemIterator);
