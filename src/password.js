import React from 'react';
import { 
	Edit,
	SimpleForm,
	TextInput,
	ImageField
} from 'admin-on-rest';

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

