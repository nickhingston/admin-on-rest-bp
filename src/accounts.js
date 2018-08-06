// in src/accounts.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { CardActions } from 'material-ui/Card';
import MuiTextField from 'material-ui/TextField'
import MuiFlatButton from 'material-ui/FlatButton';
import get from 'lodash.get';
import { accountAddUser } from './accountUserSaga';
import { Toolbar as MuiToolbar, ToolbarGroup } from 'material-ui/Toolbar';


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
	DeleteButton
	// SelectInput
	 
} from 'admin-on-rest';
import { SaveButton } from '../node_modules/admin-on-rest/lib/mui/button';

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
const DeleteUserButton = setBasePath(DeleteButton, "/accounts/");


const AccountToolbar = props => {
	let emailField = null;
	return (
	<MuiToolbar>
		<ToolbarGroup>
			<MuiTextField type="email" ref={ ref => { ref && (emailField = ref) && ref.getInputNode().setAttribute("autocomplete","nope")} } style={{ backgroundColor: "rgba(200,200,200,255)" }} hintText="Enter new user email"/>
			<MuiFlatButton primary label="Add user" onTouchTap={() => props.addUserEmail(emailField.getInputNode().value)}  />
			<SaveButton handleSubmitWithRedirect={props.handleSubmitWithRedirect} redirect="edit" />
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
		const {props} = this;
		const addUserEmail = (email) => {
			props.accountAddUser(props.form["record-form"].values, email);
		}
		return (

			<Edit title={<AccountTitle />} actions={<AccountEditActions />}  {...props}>
				<SimpleFormWithButtons autoComplete="nope" toolbar={<AccountToolbar addUserEmail={addUserEmail} redirect={null} /> } >
					<DisabledInput source="id" />	
					<TextInput source="name" autoComplete="nope" ref={(ref) => { 
						console.warn(ref)}
					} />
					{<h3>Users:</h3>}
					<EmbeddedArrayFieldWithParent elStyle={{ display: "flex", flexDirection: "row"}} source="users" ref={(ref) => this.accountRecord = (ref && ref.props.record)}>	
							<TextField label="Email" source="email" style={{display: "inline-block", margin:"10px"}}/>
							{/* this seems broken?! <SelectInput label="Account Role" source="accountRole" choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' }
                            ]} /> */}
							<EditUserButton source="" label="Edit User" style={{display: "inline-block", margin:"10px"}} />
							<RecordButton onClick={this.removeUser} label="Remove" style={{display: "inline-block", margin:"10px"}}/>
							<DeleteUserButton source="" label="Remove" style={{display: "inline-block", margin:"10px"}} />
					</EmbeddedArrayFieldWithParent>
					
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
		accountAddUser
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