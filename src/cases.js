// in src/Cases.js
import React from 'react';
import get from 'lodash.get'
import { 
	List, 
	Edit, 
	Create, 
	Datagrid, 
	ReferenceField, 
	ReferenceManyField,
	TextField, 
	ImageField,
	EditButton, 
	DisabledInput, 
	LongTextInput, 
	ReferenceInput, 
	SelectInput, 
	SimpleForm, 
	TextInput, 
	Filter,
	Responsive,
	SimpleList,
	ShowButton
} from 'admin-on-rest';


export const CaseList = (props) => (
    <List {...props} filters={<CaseFilter />}>
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            }
            medium={
                <Datagrid>
					
					{/* <img						src="http://brix.wearemothership.com:9000/api/v1/xrays/59c778f940bae943f4e4cf16/thumb"
					/> */}

					<TextField source="name" />
                    <ReferenceField label="User" source="user.id" reference="users">
                        <TextField source="email" />
                    </ReferenceField>
                    {/* <TextField source="title" />
                    <TextField source="body" /> */}
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
);

const CaseTitle = ({ record }) => {
    return <span>Case {record ? `"${record.name} by ${record.user.email}"` : ''}</span>;
};


const CaseFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="user.id" reference="users" perPage={1000} allowEmpty>
            <SelectInput optionText="email" optionValue="id"/>
        </ReferenceInput>
    </Filter>
);

export const CaseEdit = (props) => {
	return (

    <Edit title={<CaseTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
			{	
				<ReferenceInput label="User" source="user.id" reference="users">
					<SelectInput optionText="email" />
				</ReferenceInput>
			}	
            
            <TextInput source="name" />
            {/* <ReferenceManyField label="People" reference="people" source="people" target="people">	
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="firstName" />
					<TextField source="lastName" />
					<ShowButton />
					<EditButton />
                </Datagrid>
            </ReferenceManyField> */}
			<TextField source="xrays.length" />
			<ReferenceManyField label="Xrays" reference="xrays" target="caseop">	
                <Datagrid>
					<ImageField source="thumb" />
                    <TextField source="id" />
                    <TextField source="name" />
					<ShowButton />
					<EditButton />
                </Datagrid>
            </ReferenceManyField>
			{/* <TextInput source="xrays" /> */}
			<TextInput source="notes" />
			<TextInput source="createdAt" />
			<TextInput source="updatedAt" />
        </SimpleForm>
    </Edit>)
};

export const CaseCreate = (props) => {
	console.log(props);
	let isAdminUser = JSON.parse(localStorage.user).role === 'admin';
	return (
		<Create {...props}>
			<SimpleForm>
				{
					isAdminUser && 
					<ReferenceInput label="User" source="user.id" reference="users" allowEmpty>
						<SelectInput optionText="email" />
					</ReferenceInput>
				}
				<TextInput source="title" />
				<LongTextInput source="body" />
			</SimpleForm>
		</Create>
	);
};