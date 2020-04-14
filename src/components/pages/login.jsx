import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import { TextField, Avatar } from "@material-ui/core";
import LockIcon from "@material-ui/icons/LockOutlined";
import { withStyles } from "@material-ui/core/styles";
import {
	defaultTheme,
	userLogin as userLoginAction,
	FormTab,
	TabbedForm,
	Toolbar,
	useTranslate,
	TextInput
} from "react-admin";
import SubmitButton from "components/mui/buttons/SubmitButton";
import { passwordReset as passwordResetAction } from "components/pages/password";
import { registerRequest as registerRequestAction } from "sagas/registerSaga";


// TODO: need a way of /auth requests being redirected
const masterKey = process.env.REACT_APP_MASTER_KEY;
const host = process.env.REACT_APP_HOST;


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
	card: {
		minWidth: 450,
		marginTop: "6em",
	},
	avatar: {
		margin: "1em",
		display: "flex",
		justifyContent: "center",
	},
	icon: {
		backgroundColor: theme.palette.secondary[500],
	},
});

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ input: { ...inputProps }, ...props }) => {
	const { disabled, type, label } = props;
	const txtFieldProps = {
		// floatingLabelText:props.floatingLabelText,
		disabled,
		type
	};
	return (
		<TextField
			// errorText={touched && error}
			{...inputProps}
			{...txtFieldProps}
			label={label}
			style={{ marginTop: 20 }}
			// className={props.className}
			fullWidth
		/>
	);
};

const LoginRegisterTabbedForm = (props) => {
	const loginRegisterOrForgotPwd = (auth, redirect) => {
		const {
			location, userLogin, passwordReset, registerRequest
		} = props;
		if (redirect === "sign_in") { // tab 0
			userLogin(auth, location.state ? location.state.nextPathname : "/");
		}
		else if (redirect === "forgot_password") {
			// TODO: link should be current locatiokn
			localStorage.clear(); // ensure no previous token/data there...
			passwordReset(masterKey, { email: auth.username, link: `${host}/admin/password-resets` });
		}
		else if (redirect === "register") {
			// TODO: link should be current location

			localStorage.clear(); // ensure no previous token/data there...
			registerRequest({ email: auth.email, link: `${host}/admin/register` });
		}
	};

	const { submitting, location, classes } = props;
	const translate = useTranslate();

	return (
		<TabbedForm
			save={loginRegisterOrForgotPwd}
			toolbar={
				(location && location.pathname === "/login")
					? (
						<Toolbar>
							<SubmitButton
								label="mothership_admin.auth.sign_in"
								icon={null}
								redirect="sign_in"
								classes={{ button: classes.button }}
								translate={translate}
							/>
							<SubmitButton
								label="mothership_admin.auth.forgot_password"
								icon={null}
								raised={false}
								redirect="forgot_password"
								classes={{ button: classes.button }}
								translate={translate}
							/>
						</Toolbar>
					)	: (
						<Toolbar>
							<SubmitButton
								label="mothership_admin.auth.register"
								icon={null}
								redirect="register"
								classes={{ button: classes.button }}
								translate={translate}
							/>
						</Toolbar>
					)
			}
		>
			<FormTab label="mothership_admin.auth.sign_in">
				<TextInput
					id="username"
					name="username"
					className={classes.textField}
					component={renderInput}
					label={translate("mothership_admin.auth.username")}
					style={{ marginTop: 20 }}
					fullWidth
					disabled={submitting}
				/>
				<TextInput
					name="password"
					component={renderInput}
					label={translate("mothership_admin.auth.password")}
					type="password"
					style={{ marginTop: 20 }}
					fullWidth
					disabled={submitting}
				/>
			</FormTab>
			<FormTab label="mothership_admin.auth.sign_up">
				<TextInput
					name="email"
					label={translate("mothership_admin.auth.email")}
					style={{ marginTop: 20 }}
					fullWidth
					disabled={submitting}
				/>
			</FormTab>

		</TabbedForm>
	);
};

const Login = (props) => {
	const { classes } = props;
	return (
		<div
			className={classes.main}
		>
			<Card className={classes.card}>
				<div className={classes.avatar}>
					<Avatar className={classes.icon}>
						<LockIcon />
					</Avatar>
				</div>
				<LoginRegisterTabbedForm {...props} />
			</Card>
			{/* TODO: What's this?? <Notification /> */}
		</div>
	);
};

Login.propTypes = {
	userLogin: PropTypes.func.isRequired,
	passwordReset: PropTypes.func.isRequired,
	className: PropTypes.string,
	classes: PropTypes.shape({
		textField: PropTypes.string,
		main: PropTypes.string,
		avatar: PropTypes.string,
		card: PropTypes.string,
		icon: PropTypes.string
	}).isRequired,
	theme: PropTypes.shape({
		palette: PropTypes.object,
	})
};

Login.defaultProps = {
	theme: defaultTheme,
	className: ""
};

export default withStyles(styles)(connect(null, {
	userLogin: userLoginAction,
	passwordReset: passwordResetAction,
	registerRequest: registerRequestAction
})(Login));
