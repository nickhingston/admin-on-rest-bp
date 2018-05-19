// in src/plates.js
import React from 'react'
import SVGField from './mui/field/SVGField'
import { 
	List, 
	Edit,
	Show,
	Create,
	Datagrid, 
	TextField,
	DeleteButton,
	EditButton, 
	DisabledInput, 
	LongTextInput, 
	ReferenceInput, 
	SelectInput, 
	SimpleForm, 
	TextInput, 
	Filter,
	Responsive
} from 'admin-on-rest';

import { CardActions } from 'material-ui/Card';

export const PlateItemList = (props) => {
	return (
    <List title="PlateItems" filters={<PlateItemFilter />} {...props}>
		<Responsive
        
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
					<TextField source="code" />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
)};

const PlateItemFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="Plates" source="family" reference="plates" perPage={500}  allowEmpty>
			<SelectInput optionText={record => (record.manufacturer + " " + record.familyName)} />
		</ReferenceInput>
    </Filter>
);

export const PlateItemTitle = ({ record }) => {
    return <span>Plate Type: {record ? `"${record.name}"` : ''}</span>;
};

const PlateItemEditActions = ({ basePath, data, refresh, history }) => (
    <CardActions >
        <DeleteButton basePath={basePath} record={data} />
    </CardActions>
);

export const PlateItemEdit = (props) => {
	return (

    <Edit title={<PlateItemTitle />} actions={<PlateItemEditActions />} {...props}>
        <SimpleForm>
			<ReferenceInput label="Plates" source="family" reference="plates" perPage={500} allowEmpty>
            		<SelectInput optionText={record => (record.manufacturer + " " + record.familyName)} />
        	</ReferenceInput>
            <DisabledInput source="id" />	
			<TextInput source="name" />
			<TextInput source="code" />
			<LongTextInput source="src" />
			<SVGField style={{backgroundColor: "#000"}} source="src" />
			<LongTextInput source="srcFront" />
			<SVGField style={{backgroundColor: "#000"}} source="srcFront" />
        </SimpleForm>
    </Edit>)
};

export const PlateItemCreate = (props) => {
	const plateId = props.location.state && props.location.state.plate;
	return (
		<Create {...props}>
			<SimpleForm>
				
				<ReferenceInput label="Plates" source="family" reference="plates" defaultValue={plateId} perPage={500}>
            		<SelectInput optionText={record => (record.manufacturer + " " + record.familyName)} />
        		</ReferenceInput>

				{/* <TextInput source="id" /> */}
				<TextInput source="name" />
				<TextInput source="code" />
				<LongTextInput source="src" />
				<LongTextInput source="srcFront" />
			</SimpleForm>
		</Create>
	);
};

export const PlateItemShow = (props) => {
	console.log("PlateItemShow:", props);
	return (
		<Show {...props}>
			<SimpleForm>
				
				<ReferenceInput label="Plates" source="family" reference="plates" perPage={500} allowEmpty>
            		<SelectInput optionText={record => (record.manufacturer + " " + record.familyName)} />
        		</ReferenceInput>

				
				{/* TODO: why doesnt this work?!
				
				<ReferenceField label="Plate Family" source="family" reference="plates">
					<TextField source="familyName" />	
				</ReferenceField> */}

				<TextField source="id" />
				<TextField source="name" />
				<TextField source="code" />
				<SVGField style={{backgroundColor: "#000"}} source="src" />
				<SVGField style={{backgroundColor: "#000"}} source="srcFront" />
			</SimpleForm>
		</Show>
	);
};


// export const PlateItemsList = (props) => {
// 	return (
		
// 		<Datagrid>
// 			<DisabledInput source="items[0].id" />
// 			<TextField source="name" />
// 			<TextField source="code" />
// 			<EditButton />
// 		</Datagrid>
// 	);
// };