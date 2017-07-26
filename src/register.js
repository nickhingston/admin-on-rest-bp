import React, { Component } from 'react'
import { Card } from 'material-ui/Card'
import { ViewTitle, Notification, Restricted, translate, Toolbar, GET_ONE, CREATE } from 'admin-on-rest'
import { withRouter } from 'react-router-dom'
import { UserCreate } from './users'
import restService from './restClient'
import SubmitButton from './mui/buttons/SubmitButton'
import { connect } from 'react-redux'

import { 
	registerFailed as registerFailedAction,
	registerSuccess as registerSuccessAction 
} from './registerSaga'


import PropTypes from 'prop-types';
//import { propTypes, reduxForm, Field } from 'redux-form';


const restClient = restService(process.env.REACT_APP_SERVICE_API)



class RegisterClass extends Component {
	constructor(props) {
		super(props)
		this.state = { user: null, expired:false }
		this.submit = this.submit.bind(this)
	}

	componentDidMount() {
		restClient(GET_ONE, 'register', {id:this.props.regToken}).then((response) => {
			console.log(response);
			this.setState({user:response.data, expired:false})
		}).catch(e => {
			console.log('Get Register:', this.props.regToken);
			console.log(e);
			this.setState({expired:true})
		})
	}

	submit(formDetails) {
		const { repeat_password, ...rest } = formDetails
		const { registerFailed, registerSuccess, regToken } = this.props
		restClient(CREATE, 'users', {access_token:regToken, data:{...rest, email:this.state.user.email }} ).then((response) => {
			registerSuccess()
		}).catch(e => {
			registerFailed(e)
		})
	}

	render() {
		const { translate } = this.props;
		const values = this.state.user;
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
					{ this.state.user && <ViewTitle title={this.state.user.email} /> }
					{ this.state.user && UserCreate({...this.state.user, save:this.submit, values:values, toolbar})}
					{ this.state.expired && <ViewTitle title={translate('mothership_admin.register.expired')} />}
				</Card>
				<Notification/>
			</div>
		)
	}
}

RegisterClass.propTypes = {
	registerFailed: PropTypes.func,
	registerSuccess: PropTypes.func
};

const Register = connect(null, 
	{
		registerFailed:registerFailedAction, 
		registerSuccess:registerSuccessAction 
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