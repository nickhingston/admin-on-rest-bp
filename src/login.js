import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Card } from 'material-ui/Card';
import { TextField, Avatar } from 'material-ui';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import { cyan500, pinkA200 } from 'material-ui/styles/colors';
import SubmitButton from './mui/buttons/SubmitButton'

import restService from './restClient'

// TODO: need a way of /auth requests being redirected 
const masterKey = process.env.REACT_APP_MASTER_KEY;

const restClient = restService(process.env.REACT_APP_SERVICE_API)

import { defaultTheme, 
	userLogin as userLoginAction, 
	translate, 
	Notification,  
	FormTab, 
	Toolbar,
	CREATE
 } from 'admin-on-rest';

 import TabbedForm from './mui/form/TabbedForm'

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        minWidth: 300,
    },
    avatar: {
        margin: '1em',
        textAlign: 'center ',
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        display: 'flex',
    },
};

function getColorsFromTheme(theme) {
    if (!theme) return { primary1Color: cyan500, accent1Color: pinkA200 };
    const {
        palette: {
            primary1Color,
            accent1Color,
        },
      } = theme;
    return { primary1Color, accent1Color };
}

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) => {
	const txtFieldProps = {
		floatingLabelText:props.floatingLabelText,
		disabled:props.disabled,
		type:props.type
	}
	return (
    <TextField
        errorText={touched && error}
        {...inputProps}
        {...txtFieldProps}
        fullWidth
/>)
}


class LoginRegisterTabbedForm extends Component {
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
			this.props.userLogin(auth, this.props.location.state ? this.props.location.state.nextPathname : '/');
		}
		else if (redirect === "forgot_password") {
			console.log(this.values)
			restClient(CREATE, 'password-resets', {access_token:masterKey, data:{ email: auth.username, link: 'http://localhost:3000/#/password-resets'}}).then(() => {
                console.log('Sent!')
            })
            .catch((e) => {
                console.error(e);
                console.log('Error: password', 'warning')
            })
		} 
		else if (redirect === "register") {
			console.log(this.values)
			restClient(CREATE, 'register', {data:{ email: auth.email, link: 'http://localhost:3000/#/register'}}).then(() => {
				this.setState({tab:0})
            })
            .catch((e) => {
                console.error(e);
                console.log('Error: comment not approved', 'warning')
            })
		}
	}

	forgotPassword = () => {
		console.log("yeah i forgot!")
	}

	render() {
		const { submitting, translate } = this.props
		const divProps = {}

		return (
			<TabbedForm {...this.props} tabNumber={this.state.tab}  save={this.loginRegisterOrForgotPwd} tabPressed={this.tabPressed} toolbar={
			
					 this.state.tab === 0 ?
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
						name="username"
						component={renderInput}
						floatingLabelText={translate('mothership_admin.auth.username')} 
						disabled={submitting}
					/>
					<Field
						name="password"	
						component={renderInput}
						floatingLabelText={translate('mothership_admin.auth.password')}
						type="password"
						disabled={submitting}
					/>
				</FormTab>
				<FormTab label={translate('mothership_admin.auth.sign_up')}>
					<Field
						name="email"
						component={renderInput}
						floatingLabelText="email"
						disabled={submitting}
					/>
				</FormTab>
				
			</TabbedForm>
		)
	}
}


class Login extends Component {

    login = (auth) => {
		console.log('auth:', auth)
		console.log('login props:',this.props)
		this.props.userLogin(auth, this.props.location.state ? this.props.location.state.nextPathname : '/');
	}

    render() {
		console.log(this.props)
		const { theme } = this.props;
        const muiTheme = getMuiTheme(theme);
		const { primary1Color, accent1Color } = getColorsFromTheme(muiTheme);

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
			<div style={{ ...styles.main, backgroundColor: primary1Color }}>
				<Card style={styles.card}>
					<div style={styles.avatar}>
						<Avatar backgroundColor={accent1Color} icon={<LockIcon />} size={60} />
					</div>
					
					 <LoginRegisterTabbedForm { ...this.props }/> 
				</Card>
				<Notification />
			</div>
			</MuiThemeProvider>
        );
    }
}

Login.propTypes = {
	...propTypes,
    authClient: PropTypes.func,
    previousRoute: PropTypes.string,
    theme: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    userLogin: PropTypes.func.isRequired,
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
			const { translate } = props;
			console.log('enhance props:', props)
            if (!values.username) errors.username = translate('mothership_admin.validation.required');
			if (!values.password) errors.password = translate('mothership_admin.validation.required');
			//if (!values.email) errors.password = translate('mothership_admin.validation.required');
            return errors;
		},
		asyncBlurFields: []
    }),
    connect(null, { userLogin: userLoginAction }),
);

export default enhance(Login);