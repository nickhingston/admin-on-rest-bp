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
	EditButton
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
    return (
    <Edit title={<UserEmail />} {...props}>
        <SimpleForm>
			<ImageField source="picture" />
            <DisabledInput source="id" />
            <DisabledInput source="email" />
			<TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="role" />
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