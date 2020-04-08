import React, { useEffect } from "react";
import {
	showNotification,
	Notification,
	Authenticated,
	translate,
	SimpleForm,
	TextField,
	TextInput,
	Toolbar
} from "react-admin";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardHeader } from "@material-ui/core";

import PropTypes from "prop-types";
import {
	registerGet as registerGetAction,
	registerUser as registerUserAction,
} from "sagas/registerSaga";


import SubmitButton from "components/mui/buttons/SubmitButton";

const styles = (theme) => ({
	main: {
		display: "flex",
		flexDirection: "column",
		minHeight: "100vh",
		height: "1px",
		alignItems: "center",
		justifyContent: "flex-start",
		background: "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://vpop-pro.com/images/IMG_6726.jpg)",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
	},
	textField: {
		// marginLeft: theme.spacing.unit,
		// marginRight: theme.spacing.unit,
		// width: 300,
	},
	card: {
		minWidth: 450,
		marginTop: "6em",
	},
	cardHeader: {
		margin: "1em",
		display: "flex",
		justifyContent: "center",
	},
	icon: {
		backgroundColor: theme.palette.secondary[500],
	},
});

const UserCreate = (props) => (
	<SimpleForm {...props}>
		<TextField source="email" />
		<TextInput source="title" />
		<TextInput source="firstName" />
		<TextInput source="lastName" />
		<TextInput source="password" type="password" />
		<TextInput source="repeat_password" type="password" />
	</SimpleForm>
);

const RegisterClass = (props) => {
	const {
		registerGet,
		regToken,
		reg,
		registerUser,
		classes
	} = props;

	useEffect(() => {
		registerGet(regToken);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submit = (formDetails) => {
		// eslint-disable-next-line camelcase
		const { repeat_password, ...rest } = formDetails;

		// eslint-disable-next-line camelcase
		if (repeat_password === rest.password) {
			registerUser({ ...rest, email: reg.email }, regToken);
		}
		else {
			showNotification("mothership_admin.password.passwords_must_match", "warning");
		}
	};

	const toolbar = (
		<Toolbar>
			<SubmitButton
				label="mothership_admin.register.create_user"
				icon={null}
			/>
		</Toolbar>
	);
	return (
		<div className={classes.main}>
			<Card className={classes.card}>
				{/* <div className={classes.cardHeader}> */}
				<CardHeader title="Register" subheader={reg && reg.email} />
				{/* </div> */}

				{ reg && reg.email && UserCreate({
					...reg, save: submit, values: reg, toolbar
				})}
			</Card>
			<Notification />
		</div>
	);
};

RegisterClass.propTypes = {
	registerGet: PropTypes.func.isRequired,
	registerUser: PropTypes.func.isRequired,
	reg: PropTypes.objectOf(PropTypes.string),
	regToken: PropTypes.string.isRequired
};

RegisterClass.defaultProps = {
	reg: {}
};

const mapStateToProps = (state) => {
	console.log(state);
	return ({ reg: state.registrationObj });
};

const Register = withStyles(styles)(connect(mapStateToProps,
	{
		registerGet: registerGetAction,
		registerUser: registerUserAction,
		showNotification
	})(RegisterClass));


const RegisterRoute = (params) => {
	const { location } = params;

	return (
		<Authenticated authParams={{ resource: "register", route: params.match.params.id }} location={location}>
			<Register
				title={params.match.params.id}
				location={location}
				regToken={params.match.params.id}
			/>
		</Authenticated>
	);
};

export default withRouter(translate(RegisterRoute));
