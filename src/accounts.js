// in src/accounts.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import CardActions from '@material-ui/core/CardActions';
import MuiTextField from '@material-ui/core/TextField'
import MuiFlatButton from '@material-ui/core/Button';
// import get from 'lodash.get';
import { accountAddUser } from './sagas/accountUserSaga';
import { subscriptionUpdate, subscriptionDelete, subscriptionGetPlans } from './sagas/subscriptionSaga';
import { startUndoable as startUndoableAction } from 'ra-core';

import MuiToolbar from '@material-ui/core/Toolbar';

import BraintreeDropIn from "./BraintreeDropIn.js";
import PaymentMethodField from "./PaymentMethodField.js";
import CostField from "./CostField.js";
import PlainTextField from "./PlainTextField.js";

import FlatButton from '@material-ui/core/Button';
import NavigationRefresh from '@material-ui/icons/Refresh';
// import { push } from 'react-router-redux';
// import { connect } from 'react-redux';

// import { EmbeddedArrayField } from 'aor-embedded-array'
import AccountUserIterator from './AccountUserIterator';

import SimpleFormWithButtons from './mui/form/SimpleFormWithButtons'
import { 
	List, 
	Edit, 
	Create, 
	Datagrid, 
	TextField, 
	EditButton, 
	DisabledInput, 
	TextInput, 
	SimpleForm,
	Filter,
	Responsive,
	SimpleList,
	ShowButton,
	ListButton,
	DeleteButton,
	SelectInput,
	// AutocompleteInput,
	ArrayInput,
	showNotification
	 
} from 'react-admin';
import { SaveButton } from 'ra-ui-materialui/lib/button';

import countries from './countries.json';

import { refreshView as refreshViewAction } from 'ra-core';

export const AccountTitle = () => {
    return <span>Account</span>;
};

export const AccountList = (props) => {
	return (
    <List title="Account" filters={<AccountFilter />} {...props}>
		<Responsive
            small={
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            }
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
)};


const AccountFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        {/* <ReferenceInput label="User" source="user.id" reference="users" allowEmpty>
            <SelectInput optionText="email" />
        </ReferenceInput> */}
    </Filter>
);


// const CreatePlateItemButton = connect(null, {push: push })((props) => (
// 	<FlatButton primary label="Add item" onClick={() => {
// 		props.push("/plate-items/create", {plate: props.plateId});
// 	}
// 	}/>
// ));



const AccountEditActions = ({ basePath, data, refresh, history }) => (
    <CardActions >
        <ShowButton basePath={basePath} record={data} />
        <ListButton basePath={basePath} />
        <DeleteButton basePath={basePath} record={data} resource="accounts" />
        <FlatButton color="primary" label="Refresh" onClick={refresh} icon={<NavigationRefresh />}>Refresh</FlatButton>
        {/* Add your custom actions */}
        {/* <FlatButton primary label="Add plate" onClick={customAction} /> */}
		{/* <CreatePlateItemButton plateId={data && data.id}/> */}
    </CardActions>
);


const AccountToolbar = props => {
	return (
	<MuiToolbar>
		{/* <ToolbarGroup> */}
			<SaveButton handleSubmitWithRedirect={props.handleSubmitWithRedirect} redirect="edit" />
		{/* </ToolbarGroup> */}
	</MuiToolbar>);
};

const setBasePath = (WrappedComponent, path) => {
	
	return class extends React.Component {
		render() {
			const { record } = this.props;
		  // Notice that we pass through any additional props
		  return <WrappedComponent {...this.props} basePath={path} record={record}/>;
		}
	  };
}

const EditUserButton = setBasePath(EditButton, "/users");



const sanitizeEditProps = ({
	registrationObj,
	accountAddUser,
	subscriptionGetPlans,
	subscriptionUpdate,
	subscriptionDelete,
	refreshViewAction,
	showNotification,
	subscriptionPlanObj,
	passwordResetObj,
	...rest
}) => rest
class AccountEditClass extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			showUpdatePayment: false
		};
		props.subscriptionGetPlans();
	}
	render() {
		const showUpdatePayment = this.state.showUpdatePayment;
		const {props} = this;
		const addUserEmail = (email) => {
			// TODO: check actually an email!
			props.accountAddUser(props.form["record-form"].values, email);
		}
		const account = props.admin.resources.accounts.data[decodeURIComponent(props.match.params.id)];
		const { subscription } = account || {};
		const numberOfUsers = ((subscription && subscription.addOns && subscription.addOns.length && subscription.addOns[0].quantity) || 0) + 1;
		const usersChanged = (account && account.users && !showUpdatePayment && numberOfUsers !== account.users.length);
		return (

			[<Edit key="account" title={<AccountTitle />} actions={<AccountEditActions />}  {...sanitizeEditProps(props)}>
				<SimpleFormWithButtons autoComplete="nope" toolbar={<AccountToolbar redirect={null} account={account} subscriptionUpdate={props.subscriptionUpdate}/> } >
					<DisabledInput source="id" />	
					<TextInput label="Company Name" source="name" />
					<TextInput label="Contact Email" source="contactEmail" />
					<TextInput label="Contact First Name" source="contactFirstName" />
					<TextInput label="Contact Last Name" source="contactLastName" />
					
					<TextInput label="Flat/Appt no" source="contactAddress.extendedAddress" autoComplete="nope" />
					<TextInput label="Street Address" source="contactAddress.streetAddress" autoComplete="nope" />
					<TextInput label="City" source="contactAddress.locality" />
					<TextInput label="State/County" source="contactAddress.region" />
					<TextInput label="Post Code" source="contactAddress.postalCode" />
					<SelectInput label="Country" source="contactAddress.countryName" choices={countries} allowEmpty={false} autoComplete="nope" resettable/>
					
					{<h3 key="users-title">Users:</h3>}
					
					<ArrayInput source="users">
						<AccountUserIterator disableAdd>
							<TextInput disabled label=" " source="email" style={{display: "inline-block", width: "250px"}} fullWidth />
							<SelectInput label="Account Role" source="accountRole" choices={[
										{ id: 'admin', name: 'Admin' },
										{ id: 'user', name: 'User' }
							]} style={{display: "inline-block", minWidth: "100px", width: "100px", marginLeft: "20px"}}/>
							<EditUserButton source="id" label="Edit User" style={{display: "inline-block", minWidth: "100px", width: "120px", marginLeft: "20px", marginTop: "20px"}} />
						</AccountUserIterator>
					</ArrayInput>

					<MuiTextField id="add-email-field" key="email-field" type="email" label="Enter new user email" style={{display: "inline-block", minWidth: "250px" }} fullWidth/>
					<MuiFlatButton color="primary" key="add-user-button" onClick={() => addUserEmail(document.getElementById("add-email-field").value)} style={{display: "inline-block", margin:"10px"}}>Add User</MuiFlatButton>
					
				</SimpleFormWithButtons>
				
			</Edit>,
			<Edit key="subscription" title="Subscription" actions={null}  {...sanitizeEditProps(props)} style={{paddingTop: "50px" }}>
				<SimpleFormWithButtons autoComplete="nope" account={account} toolbar={null} >
				{
						(subscription && (subscription.status === "Active" || subscription.status === "Pending") && [
							<TextField key="subscription.status" label="Status" source="subscription.status"  style={{display: "inline-block"}}  />,
							<MuiFlatButton key="cancel-btn" onClick={() => startUndoableAction(props.subscriptionDelete(account)) } style={{color: "#f44336", display: "inline-block", margin:"10px", marginTop:"20px"}} >CANCEL</MuiFlatButton>,
							<PlainTextField key="no-of-users" label="Number of users" text={numberOfUsers.toString()} />,
							<TextField key="subscription.nextBillingDate" label="Next Payment Date" source="subscription.nextBillingDate" />,
							<TextField key="subscription.nextBillingPeriodAmount" label="Next Payment Amount" source="subscription.nextBillingPeriodAmount" />,
							<PaymentMethodField key="last-payment-method" label="Last Payment Method" subscription={subscription}  style={{display: "inline-block", width:"256px"}} />,
							<MuiFlatButton key="updatePayment" color="primary" onClick={() => this.setState({showUpdatePayment: !showUpdatePayment}) } style={{display: "inline-block", margin:"10px", marginTop:"20px"}} >{showUpdatePayment ? "Hide" : "Change"}</MuiFlatButton>,
							(showUpdatePayment && <BraintreeDropIn submitButtonText="Update Payment Method" key="braintree-dropin-update" currency="GBP" success={(a) => {
								this.props.showNotification('Update payment successful');
								setTimeout(() => {
									this.props.refreshViewAction();	
								},1000);
							}} failure={(err) => {
								console.warn(err);
								this.props.showNotification('Update payment failed.', 'warning');
							}} />) || null,
							(usersChanged && <CostField key="cost-field" label="Updated Cost" source="frequency" plans={props.plan} />) || null,
							(usersChanged &&<MuiFlatButton key="subscription-update" variant="contained" color="primary" onClick={() => props.subscriptionUpdate(account)}>Update</MuiFlatButton>) || null
						]) || [
							<SelectInput id="frequency-input" key="select-frequency" label="Billing Frequency" source="frequency" choices={[
                                { id: 'monthly', name: 'Monthly' },
                                { id: 'yearly', name: 'Yearly' }
							]} />,
							<CostField key="cost-field" label="Cost" source="frequency" plans={props.plan} />,
							<BraintreeDropIn submitButtonText="SUBSCRIBE" key="braintree-dropin-pay" currency="GBP" success={(a) => {
								this.props.showNotification('mothership_admin.subscription.succeeded');
								setTimeout(() => {
									this.props.refreshViewAction();	
								},10);
							}}	failure={(err) => {
								console.warn(err);
								this.props.showNotification('mothership_admin.subscription.failed', 'warning');
							}} />
						]
					}
				</SimpleFormWithButtons>	
			</Edit>]
		
			)
	}
}

const mapStateToProps = state => {
	return ({ ...state, plan: state.subscriptionPlanObj })
}

export const AccountEdit = connect(mapStateToProps, 
	{
		showNotification,
		accountAddUser,
		subscriptionGetPlans,
		subscriptionUpdate,
		subscriptionDelete,
		refreshViewAction,

	}
)(AccountEditClass);


export const AccountCreate = (props) => {
	
	return (
		<Create {...props}>
			<SimpleForm>
				<TextInput source="name" label="Company name" />
			</SimpleForm>
		</Create>
	);
};
