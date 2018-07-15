// in src/users.js
import React from 'react';
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
    DateInput
} from 'admin-on-rest';

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

export const UserEdit = (props) => {
    const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === 'admin');
    return (
    <Edit title={<UserEmail />} {...props}>
        <SimpleForm validate={validateUserSave}>
			<ImageField source="picture" />
            <DisabledInput source="id" />
            <DisabledInput source="email" />
			<TextInput source="firstName" />
            <TextInput source="lastName" />
            {isAdminUser  && <TextInput source="role" /> }
            {isAdminUser  && <DateInput source="trialEnd" /> }
            {isAdminUser  && <TextInput source="subscription" /> }
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