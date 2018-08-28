import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// import { getMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { TextField, Avatar } from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutline';
import SubmitButton from './mui/buttons/SubmitButton'

import { withStyles } from '@material-ui/core/styles';

import { passwordReset as passwordResetAction } from './password'
import { registerRequest as registerRequestAction } from './sagas/registerSaga'

// TODO: need a way of /auth requests being redirected 
const masterKey = process.env.REACT_APP_MASTER_KEY;
const host = process.env.REACT_APP_HOST || "http://ortho-prep.com:3000";
import { defaultTheme, 
	userLogin as userLoginAction, 
	translate, 
	Notification,  
	FormTab,
	TabbedForm, 
	Toolbar
 } from 'react-admin';

//  import TabbedForm from './mui/form/TabbedForm'

 const styles = theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '1px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://vpop-pro.com/images/IMG_6726.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
	},
	textField: {
		// marginLeft: theme.spacing.unit,
		// marginRight: theme.spacing.unit,
		// width: 300,
	},
    card: {
        minWidth: 450,
        marginTop: '6em',
    },
    avatar: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        backgroundColor: theme.palette.secondary[500],
    },
});

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) => {
	const txtFieldProps = {
		// floatingLabelText:props.floatingLabelText,
		disabled:props.disabled,
		type:props.type
	}
	return (
    <TextField
        // errorText={touched && error}
        {...inputProps}
		{...txtFieldProps}
		label={props.label}
		style={ {marginTop: 20}}
		// className={props.className}
        fullWidth
/>)
}

const sanitizeLoginRestProps = ({
	userLogin,
	passwordReset,
	registerRequest,
	anyTouched,
	classes,
	...rest
}) => rest;

class LoginRegisterTabbedForm_ extends Component {
	constructor(props) {
		super(props)
		this.state = { tab:0 }
		this.tabPressed = this.tabPressed.bind(this)
		this.loginRegisterOrForgotPwd = this.loginRegisterOrForgotPwd.bind(this)
	}

	tabPressed = (tab) => {
		console.log(tab)
		this.setState({ tab })
	}

	loginRegisterOrForgotPwd = (auth, redirect) => {
		if (redirect === "sign_in") { // tab 0
			this.props.userLogin(auth, this.props.location.state ? this.props.location.state.nextPathname : '/')
		}
		else if (redirect === "forgot_password") {
			// TODO: link should be current locatiokn
			localStorage.clear();  // ensure no previous token/data there...
			this.props.passwordReset(masterKey, { email: auth.username, link: host +'/password-resets'})
		} 
		else if (redirect === "register") {
			// TODO: link should be current location
			
			localStorage.clear();  // ensure no previous token/data there...
			this.props.registerRequest({ email: auth.email, link: host +'/register'})
		}
	}

	render() {
		const { submitting, translate, location, classes } = this.props

		return (
			<TabbedForm {...sanitizeLoginRestProps(this.props)} save={this.loginRegisterOrForgotPwd} toolbar={
			
					 (location && location.pathname === '/login') ?
						<Toolbar>
							<SubmitButton 	
								label='mothership_admin.auth.sign_in'
								icon={null}
								handleSubmitWithRedirect={null}
								redirect="sign_in"
							/> 	
							<SubmitButton
								label='mothership_admin.auth.forgot_password'
								icon={null}
								handleSubmitWithRedirect={null}
								raised={false}
								redirect="forgot_password"
							/> 
						</Toolbar>	: <Toolbar> 
							<SubmitButton 
								label='mothership_admin.auth.register'
								icon={null}
								handleSubmitWithRedirect={null}
								redirect="register"
							/>
						</Toolbar>	
					} >
				<FormTab label={translate('mothership_admin.auth.sign_in')} >
					<Field
						id="username"
						name="username"
						className={classes.textField}
						component={renderInput}
						label="User Name"
						// floatingLabelText={translate('mothership_admin.auth.username')} 
						disabled={submitting}
					/>
					<Field
						name="password"	
						component={renderInput}
						label="Password"
						// floatingLabelText={translate('mothership_admin.auth.password')}
						type="password"
						disabled={submitting}
					/>
				</FormTab>
				<FormTab label={translate('mothership_admin.auth.sign_up')}>
					<Field
						name="email"
						label="Email"
						component={renderInput}
						// floatingLabelText="email"
						disabled={submitting}
					/>
				</FormTab>
				
			</TabbedForm>
		)
	}
}

const LoginRegisterTabbedForm = connect(null,{
	
}) (LoginRegisterTabbedForm_)

class Login extends Component {

    render() {
		const { classes } = this.props
        return (
			<div
				className={classes.main}
				// {...sanitizeRestProps(rest)}
			>
				<Card className={classes.card}>
					<div className={classes.avatar}>
						<Avatar className={classes.icon}>
							<LockIcon />
						</Avatar>
					</div>
					<LoginRegisterTabbedForm { ...this.props } translate={this.props.translate}/> 
				</Card>
				<Notification />
			</div>
        );
    }
}

Login.contextTypes = {
    translate: PropTypes.func,
};

Login.propTypes = {
	// ...propTypes,
    // authClient: PropTypes.func,
    // previousRoute: PropTypes.string,
    // theme: PropTypes.object.isRequired,
    // translate: PropTypes.func.isRequired,
	userLogin: PropTypes.func.isRequired,
	resetPassword: PropTypes.func,
	className: PropTypes.string,
    authProvider: PropTypes.func,
    classes: PropTypes.object,
    input: PropTypes.object,
    meta: PropTypes.object,
    previousRoute: PropTypes.string
};

Login.defaultProps = {
    theme: defaultTheme,
};

const enhance = compose(
    translate,
    reduxForm({
        form: 'signIn',
        validate: (values, props) => {
            const errors = {};
			// const { translate } = props;
			// if (!values.username) errors.username = translate('mothership_admin.validation.required');
			// if (!values.password) errors.password = translate('mothership_admin.validation.required');
			// if (!values.email) errors.email	 = translate('mothership_admin.validation.required');
            return errors;
		},
		asyncBlurFields: []
    }),
	connect(null, { userLogin: userLoginAction,
					passwordReset:passwordResetAction,
					registerRequest:registerRequestAction
				  })
);

export default withStyles(styles)(enhance(Login));