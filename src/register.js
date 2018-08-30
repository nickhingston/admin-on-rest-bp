import React, { Component } from 'react'
import { ViewTitle,
	showNotification,
	Notification,
	Authenticated,
	translate,
	Toolbar } from 'react-admin'

import { withRouter } from 'react-router-dom'
import { UserCreate } from './users'
import SubmitButton from './mui/buttons/SubmitButton'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader  } from '@material-ui/core';

import { 
	registerGet as registerGetAction,
	registerUser as registerUserAction,
} from './sagas/registerSaga'


import PropTypes from 'prop-types';

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
    cardHeader: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        backgroundColor: theme.palette.secondary[500],
    },
});

class RegisterClass extends Component {
	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
	}

	componentDidMount() {
		this.props.registerGet(this.props.regToken)
	}

	submit(formDetails) {
		const { repeat_password, ...rest } = formDetails
		const { regToken, reg } = this.props

		if (repeat_password === rest.password) {
			this.props.registerUser({...rest, email:reg.email }, regToken)
		}
		else {
			this.props.showNotification('mothership_admin.password.passwords_must_match', 'warning')
		}
	}

	render() {
		const { translate, reg, classes } = this.props;
		const toolbar = (<Toolbar>
								<SubmitButton 
									label='mothership_admin.register.create_user'
									icon={null}
									handleSubmitWithRedirect={null}
                        		/> 	
							</Toolbar>)
		return (
			<div className={classes.main}>
				<Card className={classes.card}>
					{/* <div className={classes.cardHeader}> */}
						<CardHeader title="Register" subheader={reg && reg.email} />
					{/* </div> */}

					{ reg && reg.email && UserCreate({...reg, save:this.submit, values:reg, toolbar})}
					{ reg===null && <ViewTitle title={translate('mothership_admin.register.expired')} />}
				</Card>
				<Notification/>
			</div>
		)
	}
}

RegisterClass.propTypes = {
	registerGet: PropTypes.func,
	registerUser: PropTypes.func,

	reg:PropTypes.object,
	regToken: PropTypes.string.isRequired
};


const mapStateToProps = state => {
	console.log(state)
	return ({ reg: state.registrationObj })
}

const Register = withStyles(styles)(connect(mapStateToProps, 
	{
		registerGet:registerGetAction,
		registerUser:registerUserAction,
		showNotification
	}
)(RegisterClass))


const RegisterRoute = (params)  => {

	const { location, translate } = params

	return (
		<Authenticated authParams={{ resource: 'register', route:params.match.params.id }} location={location} >
			<Register title={params.match.params.id} location={location} regToken={params.match.params.id} translate={translate} />
		</Authenticated>	
	)
}

export default withRouter(translate(RegisterRoute));	