import React, { Component } from 'react'
import { Card } from 'material-ui/Card'
import { ViewTitle, Notification, Restricted, translate, Toolbar } from 'admin-on-rest'
import { withRouter } from 'react-router-dom'
import { UserCreate } from './users'
import SubmitButton from './mui/buttons/SubmitButton'
import { connect } from 'react-redux'

import { 
	registerGet as registerGetAction,
	registerUser as registerUserAction,
} from './registerSaga'


import PropTypes from 'prop-types';



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

		this.props.registerUser({...rest, email:reg.email }, regToken)
	}

	render() {
		const { translate, reg } = this.props;
		const toolbar = (<Toolbar>
								<SubmitButton 
									label='mothership_admin.register.create_user'
									icon={null}
									handleSubmitWithRedirect={null}
                        		/> 	
							</Toolbar>)
		return (
			<div >
				<Card >
					{ reg && reg.email && <ViewTitle title={reg.email} /> }
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

const Register = connect(mapStateToProps, 
	{
		registerGet:registerGetAction,
		registerUser:registerUserAction,
	}
)(RegisterClass)


const RegisterRoute = (params)  => {

	const { location, translate } = params

	return (
		<Restricted authParams={{ resource: 'register', route:params.match.params.id }} location={location} >
			<Register title={params.match.params.id} location={location} regToken={params.match.params.id} translate={translate} />
		</Restricted>	
	)
}

export default withRouter(translate(RegisterRoute));	