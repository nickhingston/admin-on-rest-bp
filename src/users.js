// in src/users.js
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { 
    Create,
	Edit,
    List,
	Responsive,
	SimpleForm,
	SimpleList,
	Filter,
	DisabledInput,
	TextInput,
	Datagrid,
	EmailField,
	TextField,
	ImageField,
    EditButton,
    DateInput,
    SelectInput
} from 'admin-on-rest';

import BraintreeDropIn from "./BraintreeDropIn.js";

const validateUserSave = (values) => {
    const errors = {};
    if (!values.trialEnd) {
        errors.trialEnd = ['TrialEnd is required'];
    }
    else {
        values.trialEnd = values.trialEnd.valueOf();
    }
    
    return errors
};

const SmallImageField = function (ref) {
	var imageField = ImageField(ref);
	imageField.props.children.props.style.maxHeight = '2rem';
	return imageField;
}


export const UserList = (props) => (
    <List title="All users" filters={<UserFilter />} {...props}>
		<Responsive
            small={
                <SimpleList
                    primaryText={record => `${record}`}// record.email}
                    //secondaryText={record => `${record.views} views`}
                    //tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            }
            medium={
                <Datagrid>
					<SmallImageField source="picture" elStyle={{ image: {backgroundColor: "black", height: "2rem" }}} />
                    <TextField source="id" />
                    <EmailField source="email" />
					<TextField source="role" />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
);



const UserEmail = ({ record }) => {
    return <span>{record.email}</span>;
};

const CreateAccountButton = connect(null, {push: push })((props) => (
	<FlatButton primary label="Create Account" onClick={() => {
		props.push("/accounts/create", {user: props.userId});
	}
	}/>
));

const ViewAccountButton = connect(null, {push: push })((props) => (
	<FlatButton primary label="Show Account" onClick={() => {
		props.push("/accounts/" + props.accountId, {user: props.userId});
	}
	}/>
));

const UserEditActions = ({ basePath, data, refresh, history }) => {
    const { account } = data || {};
    return (
        <CardActions >
            {/* <ShowButton basePath={basePath} record={data} />
            <ListButton basePath={basePath} />
            <DeleteButton basePath={basePath} record={data} /> */}
            <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
            {/* Add your custom actions */}
            {/* <FlatButton primary label="Add plate" onClick={customAction} /> */}
            { !account && <CreateAccountButton userId={data && data.id}/> }
            { account && <ViewAccountButton accountId={account}/> }
        </CardActions>
    );
};

export const UserEdit = (props) => {
    const user = localStorage.user && JSON.parse(localStorage.user);
    const isAdminUser = (user && user.role === 'admin');
    const account = user && user.account;
    return (
    <Edit title={<UserEmail />} actions={<UserEditActions />} {...props}>
        <SimpleForm validate={validateUserSave}>
			<ImageField source="picture" />
            {isAdminUser  && <DisabledInput source="id" /> }
            <DisabledInput source="email"/>
			<TextInput label="First Name" source="firstName" />
            <TextInput label="Last Name" source="lastName" />
            {isAdminUser  && <SelectInput label="Role" source="role" choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' }
                            ]} />}
            {isAdminUser  && <DateInput source="trialEnd" /> }
            {isAdminUser  && <TextInput source="subscription" /> }
            {account && <SelectInput label="Account Role" source="accountRole" choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' }
                            ]} /> }
            {!account && <BraintreeDropIn currency="GBP" total="12.50" success={(a) => {
                console.log("complete:", a);
            }} />}
        </SimpleForm>
    </Edit>
)}

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);


// Create a user from a registration from
export const UserCreate = (props) => {
	return (
        <SimpleForm {...props} >
            {/* <TextField source="email" /> */}
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="password" type="password"  />
            <TextInput source="repeat_password" type="password" />
        </SimpleForm>
	);
};

// Create a user logged in with an admin user
export const UserCreateWithAdmin = (props) => {
	//let isAdminUser = JSON.parse(localStorage.user).role === 'admin';
	return (
		<Create {...props}>
			<SimpleForm {...props} >
                 <TextField source="email" /> 
                <TextInput source="name" />
                <TextInput source="password" type="password"  />
                <TextInput source="repeat_password" type="password" />
			</SimpleForm>
	 	</Create> 
	);
};