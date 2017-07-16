import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Card } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import { cyan500, pinkA200 } from 'material-ui/styles/colors';

import { defaultTheme, userLogin as userLoginAction, translate, Notification, TabbedForm, FormTab,
 } from 'admin-on-rest';

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
		disabled:props.disabled
	}
	return (
    <TextField
        errorText={touched && error}
        {...inputProps}
        {...txtFieldProps}
        fullWidth
/>)
}

const tabPressed = (x,y,z) => {
	console.log('tabPressed: ', x, ',', y, ',', z)
}

class TabbedForm_ extends TabbedForm {
	handleChange = (value) => {
		console.log("setting the fucking value")
        this.setState({ value });
	}
	
	render() {
		return <TabbedForm {...this.props}/>
		//return <WrappedComponent {...this.props}/>
	}
}

class Login extends Component {

    login = (auth) => {
		console.log('auth:', auth)
		console.log('login props:',this.props)
		this.props.userLogin(auth, this.props.location.state ? this.props.location.state.nextPathname : '/');
	}

	loginOrRegister = (auth) => {
		// console.log('stoat: ', x, ',', y, ',', z)
		console.log(this.fieldEditor1)
		this.props.userLogin(auth, this.props.location.state ? this.props.location.state.nextPathname : '/');
		console.log(this.formDiv.props.children[0])
	}
	
	componentWillReceiveProps(nextProps) {
		console.log(nextProps)

	}

	constructor(props) {
		super(props)
		console.log('props: ', props)
		console.log('state1: ', this.state)
		this.state = {date: new Date(), tab:1}
		console.log('state2: ', this.state)
	  }
	
	componentDidMount() {
        console.log("children:", this.props.children);
	}
	tabClicked() {
		console.log('clicked')
	}

    render() {
		console.log(this.props)
		const { children, handleSubmit, submitting, theme, translate, userLogin } = this.props;
		const props = { translate:translate }
		const none = {}
        const muiTheme = getMuiTheme(theme);
        const { primary1Color, accent1Color } = getColorsFromTheme(muiTheme);
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
			<div style={{ ...styles.main, backgroundColor: primary1Color }} >
				<Card style={styles.card}>
					<div style={styles.avatar}>
						<Avatar backgroundColor={accent1Color} icon={<LockIcon />} size={60} />
					</div>
					<TabbedForm_ {...props} label="stoat" save={this.loginOrRegister} ref={(formDiv) => { this.formDiv = formDiv; }}>
						<FormTab label="sign in" handleActive={this.tabClicked} >
							<Field onClick={this.tabClicked}
								name="username"
								component={renderInput}
								floatingLabelText={translate('aor.auth.username')} 
								disabled={submitting}
							/>
							<Field
								name="password"
								component={renderInput}
								floatingLabelText={translate('aor.auth.password')}
								type="password"
								disabled={submitting}
							/>
						</FormTab>
						<FormTab label="sign up" onClick={this.tabClicked} handleActive={this.tabClicked}>
							<Field
								name="email"
								component={renderInput}
								floatingLabelText="email"
								disabled={submitting}
							/>
						</FormTab>
						
					</TabbedForm_>
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
            if (!values.username) errors.username = translate('aor.validation.required');
            if (!values.password) errors.password = translate('aor.validation.required');
            return errors;
        },
    }),
    connect(null, { userLogin: userLoginAction }),
);

export default enhance(Login);