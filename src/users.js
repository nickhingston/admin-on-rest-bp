// in src/users.js
import React from 'react';
import { 
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
                    //{/*tertiaryText={record => new Date(record.published_at).toLocaleDateString()}*/}
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

export const UserEdit = (props) => (
    <Edit title={<UserEmail />} {...props}>
        <SimpleForm>
			<ImageField source="picture" />
            <DisabledInput source="id" />
            <DisabledInput source="email" />
			<TextInput source="name" />
            <TextInput source="role" />
        </SimpleForm>
    </Edit>
);

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);