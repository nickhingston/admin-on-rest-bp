import React from 'react';
import { 
   Create,
   Show,
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
	Restricted,
	Card,
	Toolbar,
	translate
} from 'admin-on-rest';
import SubmitButton from './mui/buttons/SubmitButton'


import { withRouter } from 'react-router-dom'

const UserEmail = ({ record }) => {
    return <span>{record.user.email}</span>;
};

export const PasswordEdit = (props) => {
	console.log('PasswordEdit:', props)
	return (
		<Edit title={<UserEmail />} {...props}>
			<SimpleForm redirect="/">	
				<ImageField source="user.picture" />
                <TextInput source="password" type="password"  />
                <TextInput source="repeat_password" type="password" />
			</SimpleForm>
	 	</Edit> 
	);
};

