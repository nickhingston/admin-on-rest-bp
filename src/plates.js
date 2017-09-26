// in src/plates.js
import React from 'react';

import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';

import { 
	List, 
	Edit, 
	Create, 
	Datagrid, 
	ReferenceField, 
	TextField, 
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
	ReferenceManyField,
	ShowButton,
	ListButton,
	DeleteButton,
	CreateButton
} from 'admin-on-rest';


export const PlatesList = (props) => {
	console.log("PlatesList");
	console.log(props);
	return (
    <List title="Plates" filters={<PlatesFilter />} {...props}>
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
                    <TextField source="id" />
                    <TextField source="familyName" />
					<TextField source="category" />
					<TextField source="manufacturer" />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
)};

export const PlatesTitle = ({ record }) => {
    return <span>Plate Type: {record ? `"${record.familyName}"` : ''}</span>;
};


const PlatesFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        {/* <ReferenceInput label="User" source="user.id" reference="users" allowEmpty>
            <SelectInput optionText="email" />
        </ReferenceInput> */}
    </Filter>
);

const PlatesEditActions = ({ basePath, data, refresh }) => (
    <CardActions >
        <ShowButton basePath={basePath} record={data} />
        <ListButton basePath={basePath} />
        <DeleteButton basePath={basePath} record={data} />
        <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
        {/* Add your custom actions */}
        {/* <FlatButton primary label="Add plate" onClick={customAction} /> */}
		<CreateButton label="Add item" basePath="/plate-items" />
    </CardActions>
);


export const PlatesEdit = (props) => {
	
	return (

    <Edit title={<PlatesTitle />} actions={<PlatesEditActions />}  {...props}>
        <SimpleForm>
            <DisabledInput source="id" />	
            <TextInput source="familyName" />
			<TextInput source="category" />
			<TextInput source="manufacturer" />
			<TextInput source="defaultItemIndex" />
			<TextInput source="flipAxis" />
			
			<ReferenceManyField label="Items" reference="plate-items" source="items" target="family">	
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
					<TextField source="code" />
					<ShowButton />
					<EditButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
	</Edit>
	)
};

export const PlatesCreate = (props) => {
	
	return (
		<Create {...props}>
			<SimpleForm>
				<TextInput source="familyName" />
				<TextInput source="category" />
				<TextInput source="manufacturer" />
				<TextInput source="defaultItemIndex" />
				<TextInput source="flipAxis" />
			</SimpleForm>
		</Create>
	);
};


export const PlateItemsList = (props) => {
	return (
		
		<Datagrid>
			<DisabledInput source="items[0].id" />
			<TextField source="name" />
			<TextField source="category" />
			<TextField source="code" />
			<EditButton />
		</Datagrid>
	);
};