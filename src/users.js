// in src/users.js
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { unparse as convertToCSV } from 'papaparse/papaparse.min';
import get from 'lodash/get';

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
    SelectInput,
    downloadCSV
} from 'react-admin';

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

const sifStyle = {
    image : {
        maxHeight: '2rem'
    }
}

const SmallImageField = withStyles(sifStyle)(({ classes, ...props }) => (
	<ImageField classes={classes} {...props} />
));

const SubscriptionStatusField = ({ source, record = {} }) =>  {
    const subscription = get(record, source);
    let text = "None";
    if (subscription) {
        if (subscription.status) {
            text = `${subscription.status} (${subscription.id})`;
        }
        else {
            // apple?
            text = `apple (${subscription.expirationDate})`;
        }
    }
    return <span>{text}</span>;
}

const usersExporter = (data) => {
    const users = data.map(user => {
        const { subscription, ...userForExport } = user;
        let text = "None";
        let expirationDate = "";
        if (subscription) {
            if (subscription.status) {
                text = `${subscription.status} (${subscription.id})`;
            }
            else {
                // apple?
                text = 'apple';
                expirationDate = new Date(subscription.expirationDate);
            }
        }
        else {
            if (user.trialPeriodRemaining) {
                text = "Trial";
                expirationDate = new Date(user.trialEnd);
            }
        }
        userForExport.subscription = text;
        userForExport.expirationDate = expirationDate;
        return  userForExport;
    });

    const csv = convertToCSV({
        data: users,
        fields: ['id', 'email', 'subscription', 'expirationDate', 'role', 'accountRole', 'account']
    });
    downloadCSV(csv, 'users');
}

export const UserList = (props) => (
    <List title="All users" filters={<UserFilter />} exporter={usersExporter} {...props}>
		<Responsive
            small={
                <SimpleList
                    primaryText={record => record.email}
                />
            }
            medium={
                <Datagrid>
					<SmallImageField source="picture" style={{ image: {backgroundColor: "black", height: "2rem" }}} />
                    <TextField source="id" />
                    <EmailField source="email" />
                    <SubscriptionStatusField source="subscription" /> 
                    {/* render={(subscription) => {
                        if (!subscription) {
                            return "none";
                        }
                        if (subscription.status) {
                            return subscription.status
                        }
                        console.log("other:");
                        console.log(subscription);
                    }} /> */}
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
	<Button color="primary" variant="contained" onClick={() => {
		props.push("/accounts/create", {user: props.userId});
	}
	}>Create Organisation</Button>
));

const ViewAccountButton = connect(null, {push: push })((props) => (
	<Button color="primary" variant="outlined" onClick={() => {
		props.push("/accounts/" + props.accountId, {user: props.userId});
	}
	}>Show Organisation</Button>
));

const UserEditActions = ({ basePath, data, refresh, history }) => {
    const { account } = data || {};
    return (
        <CardActions >
            {/* <ShowButton basePath={basePath} record={data} />
            <ListButton basePath={basePath} />
            <DeleteButton basePath={basePath} record={data} /> */}
            {/* <Button primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} /> */}
            {/* Add your custom actions */}
            {/* <Button primary label="Add plate" onClick={customAction} /> */}
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
            { isAdminUser && <ImageField source="picture" /> }
            { isAdminUser  && <DisabledInput source="id" /> }
            <DisabledInput source="email"/>
			<TextInput label="First Name" source="firstName" />
            <TextInput label="Last Name" source="lastName" />
            { isAdminUser  && <SelectInput label="Role" source="role" choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' }
                            ]} />}
            { isAdminUser  && <DateInput source="trialEnd" parse={(d) => new Date(d).valueOf()} /> }
            { isAdminUser  && <TextInput source="subscription.id" disabled/> }
            { isAdminUser  && <TextInput source="subscription.status" disabled/> }
            { account && <SelectInput label="Account Role" source="accountRole" choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' }
                            ]} /> }
            { false && !account && <BraintreeDropIn currency="GBP" total="12.50" success={(a) => {
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