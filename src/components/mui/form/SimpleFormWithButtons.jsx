// copied from SimpleForm.js
import React, { Children } from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import { FormInput, Toolbar } from "react-admin";

const formStyle = { padding: "0 1em 1em 1em" };

const SimpleFormWithButtonsComponent = (props) => {
	const handleSubmitWithRedirect = () => props.handleSubmit((values) => props.save(values, "edit"));

	const {
		basePath,
		children,
		record,
		resource,
		toolbar,
		version,
	} = props;

	return (
		<form className="simple-form">
			<div style={formStyle} key={version}>
				{Children.map(children, (input) => input
			&& (
				<div key={input.props.source} className={`ra-input-${input.props.source}`} style={input.props.style}>
					{
						(!input.type.name && input)
					|| (input.type.name === "FlatButton" && input)
					|| (input.type.name === "TextField" && input)
					|| (input.type.name === "WithStyles" && input)
					// hack
					|| (input.props.id === "frequency-input" && (
						<FormInput
							input={React.cloneElement(input, {
								onChange: () => {
									setTimeout(() => {
										handleSubmitWithRedirect()();
									}, 10);
								}
							})}
							resource={resource}
							record={record}
							basePath={basePath}
						/>
					))
					// end hack
					|| <FormInput input={input} resource={resource} record={record} basePath={basePath} />
					}
				</div>
			))}
			</div>
			{toolbar && React.cloneElement(toolbar, {
				handleSubmitWithRedirect
			})}
		</form>
	);
};

SimpleFormWithButtonsComponent.propTypes = {
	basePath: PropTypes.string,
	children: PropTypes.node,
	handleSubmit: PropTypes.func, // passed by redux-form
	record: PropTypes.shape({}),
	resource: PropTypes.string,
	save: PropTypes.func.isRequired,
	toolbar: PropTypes.element,
	version: PropTypes.number,
};

SimpleFormWithButtonsComponent.defaultProps = {
	toolbar: <Toolbar />,
	basePath: "",
	children: null,
	handleSubmit: null,
	record: null,
	resource: "",
	version: 1
};

export default reduxForm({
	form: "record-form",
	enableReinitialize: true,
})(SimpleFormWithButtonsComponent);
