// in src/accounts.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { CardActions } from 'material-ui/Card';
import MuiTextField from 'material-ui/TextField'
import MuiFlatButton from 'material-ui/FlatButton';
import get from 'lodash.get';
import { accountAddUser } from './accountUserSaga';
import { subscriptionUpdate, subscriptionDelete } from './subscriptionActions';

import { Toolbar as MuiToolbar, ToolbarGroup } from 'material-ui/Toolbar';

import BraintreeDropIn from "./BraintreeDropIn.js";
import PaymentMethodField from "./PaymentMethodField.js";
import PlainTextField from "./PlainTextField.js";

import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
// import { push } from 'react-router-redux';
// import { connect } from 'react-redux';
import RecordButton from './recordButton'

import { EmbeddedArrayField } from 'aor-embedded-array'
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
	AutocompleteInput
	 
} from 'admin-on-rest';
import { SaveButton } from '../node_modules/admin-on-rest/lib/mui/button';

import countries from './countries.json';

export const AccountTitle = ({ record }) => {
    return <span>Account name: {record ? `"${record.name || "New"}"` : ''}</span>;
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
        <DeleteButton basePath={basePath} record={data} />
        <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
        {/* Add your custom actions */}
        {/* <FlatButton primary label="Add plate" onClick={customAction} /> */}
		{/* <CreatePlateItemButton plateId={data && data.id}/> */}
    </CardActions>
);

const passParentRecord = (WrappedComponent) => {
	
	return class extends React.Component {
		render() {
		  // Notice that we pass through any additional props
		  return <WrappedComponent {...this.props} parentRecord={this.props.record} meta={{touched:false, error:null}}/>;
		}
	  };
}

const EmbeddedArrayFieldWithParent = passParentRecord(EmbeddedArrayField);

const setBasePath = (WrappedComponent, path) => {
	
	return class extends React.Component {
		render() {
			const {source, record } = this.props;
			const item = get(record, source)
		  // Notice that we pass through any additional props
		  return <WrappedComponent {...this.props} basePath={path} record={item}/>;
		}
	  };
}

const EditUserButton = setBasePath(EditButton, "/users");


const AccountToolbar = props => {
	return (
	<MuiToolbar>
		<ToolbarGroup>
			<SaveButton handleSubmitWithRedirect={props.handleSubmitWithRedirect} redirect="edit" />
			<MuiFlatButton primary label="Update payment!" onClick={() => props.subscriptionUpdate(props.account, 'fake-valid-nonce')}  />
		</ToolbarGroup>
	</MuiToolbar>);
};

class AccountEditClass extends Component {
	constructor(props) {
		super(props);
		this.removeUser = this.removeUser.bind(this);
	}
	removeUser(record) {
		console.log(record)
		console.log(this.accountRecord)
		let i = this.accountRecord.users.indexOf(record)
		if (i > 0) {
			let users = [...this.accountRecord.users];
			users.splice(i, 1);
			this.accountRecord.users = users;
		}
		this.setState({})
	}
	render() {
		let emailField = null;
		const {props} = this;
		const addUserEmail = (email) => {
			// TODO: check actually an email!
			props.accountAddUser(props.form["record-form"].values, email);
		}
		const account = props.admin.resources.accounts.data[decodeURIComponent(props.match.params.id)];
		const { subscription } = account || {};
		const numberOfUsers = ((subscription && subscription.addOns && subscription.addOns.length && subscription.addOns[0].quantity) || 0) + 1
		return (

			<Edit title={<AccountTitle />} actions={<AccountEditActions />}  {...props}>
				<SimpleFormWithButtons autoComplete="nope" toolbar={<AccountToolbar redirect={null} account={account} subscriptionUpdate={props.subscriptionUpdate}/> } >
					<DisabledInput source="id" />	
					<TextInput label="Company Name" source="name" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					<TextInput label="Contact Email" source="contactEmail" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					<TextInput label="Contact First Name" source="contactFirstName" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					<TextInput label="Contact Last Name" source="contactLastName" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					
					<TextInput label="Flat/Appt no" source="contactAddress.extendedAddress" autoComplete="nope" ref={ ref => { 
						ref && 
						ref.getInputNode().setAttribute("autocomplete","nope");
						console.log("BAAAH:", ref)} 
					} />
					<TextInput label="Street Address" source="contactAddress.streetAddress" autoComplete="nope" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					<TextInput label="City" source="contactAddress.locality" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					<TextInput label="State/County" source="contactAddress.region" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					<TextInput label="Post Code" source="contactAddress.postalCode" ref={ ref => { ref && ref.getInputNode().setAttribute("autocomplete","nope")} } />
					<AutocompleteInput label="Country" source="contactAddress.countryName" choices={countries} allowEmpty={false} />
					
					{<h3>Users:</h3>}
					<EmbeddedArrayFieldWithParent elStyle={{ display: "flex", flexDirection: "row"}} source="users" ref={(ref) => this.accountRecord = (ref && ref.props.record)}>	
							<TextField label="Email" source="email" style={{display: "inline-block", margin:"10px"}}/>
							{/* this seems broken?! <SelectInput label="Account Role" source="accountRole" choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' }
                            ]} /> */}
							<EditUserButton source="" label="Edit User" style={{display: "inline-block", margin:"10px"}} />
							<RecordButton primary source="" onClick={this.removeUser} label="Remove" style={{display: "inline-block", margin:"10px"}}/>
					</EmbeddedArrayFieldWithParent>
					<MuiTextField key="email-field" type="email" ref={ ref => { ref && (emailField = ref) && ref.getInputNode().setAttribute("autocomplete","nope")} } hintText="Enter new user email" style={{display: "inline-block"}}/>
					<MuiFlatButton primary key="add-user-button" label="Add user" onClick={() => addUserEmail(emailField.getInputNode().value)} style={{display: "inline-block", margin:"10px"}} />
					{
						(subscription && (subscription.status === "Active" || subscription.status === "Pending") && [
							<h3 key="subscription" >Subscription:</h3>,
							<TextField key="subscription.status" label="Status" source="subscription.status"  style={{display: "inline-block"}}  />,
							<MuiFlatButton key="cancel-btn" secondary label="CANCEL" onClick={() => props.subscriptionDelete(account) } style={{display: "inline-block", margin:"10px"}} />,
							<PlainTextField key="no-of-users" label="Number of users" text={numberOfUsers.toString()} />,
							<TextField key="subscription.nextBillingDate" label="Next Payment Date" source="subscription.nextBillingDate" />,
							<TextField key="subscription.nextBillingPeriodAmount" label="Next Payment Amount" source="subscription.nextBillingPeriodAmount" />,
							<PaymentMethodField key="last-payment-method" label="Last Payment Method" subscription={subscription} />,
							<BraintreeDropIn key="braintree-dropin-update" currency="GBP" success={(a) => {
								console.log("complete:", a);
							}} />
						]) || [
							<h3  key="subscribe">Subscribe:</h3>,
							(subscription ? <TextField key="subscription.nextBillingDate" label="Subscription End Date" source="subscription.nextBillingDate" /> : null),
							<SelectInput key="select-frequency" label="Billing Frequency" source="frequency" choices={[
                                { id: 'monthly', name: 'Monthly' },
                                { id: 'yearly', name: 'Yearly' }
                            ]} />,
							<BraintreeDropIn key="braintree-dropin-pay" currency="GBP" success={(a) => {
								console.log("complete:", a);
							}} />
						]
					}
					{/* <MuiTextInput source="new_email" style={{display: "inline-block", margin:"10px"}} autoComplete="nope" ref={(ref) => this.newEmailRef = (ref)}/>
					<AddEmailButton primary label="Add User" style={{display: "inline-block", margin:"10px"}} onClick={onClick}/> */}
				</SimpleFormWithButtons>
				
			</Edit>
		
			)
	}
}

const mapStateToProps = state => {
	return state;
}

export const AccountEdit = connect(mapStateToProps, 
	{
		accountAddUser,
		subscriptionUpdate,
		subscriptionDelete
	}
)(AccountEditClass);


export const AccountCreate = (props) => {
	
	return (
		<Create {...props}>
			<SimpleForm>
				<TextInput source="name" />
			</SimpleForm>
		</Create>
	);
};


export const AccountUsersList = (props) => {
	return (
		
		<Datagrid>
			<TextField source="name" />
			<EditButton />
		</Datagrid>
	);
};