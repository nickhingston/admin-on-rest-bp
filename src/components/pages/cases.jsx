// in src/Cases.js
import React from "react";

import {
	BooleanInput,
	List,
	Edit,
	Create,
	Datagrid,
	ReferenceField,
	ReferenceManyField,
	TextField,
	ImageField,
	EditButton,
	ReferenceInput,
	SimpleForm,
	TextInput,
	Filter,
	Responsive,
	SimpleList,
	ShowButton,
	AutocompleteInput
} from "react-admin";


export const CaseList = (props) => (
	<List {...props} filters={<CaseFilter />} bulkActionButtons={false}>
		<Responsive
			small={(
				<SimpleList
					primaryText={(record) => record.name}
					secondaryText={(record) => (
						<ReferenceField label="User" source="user.id" reference="users" basePath="users" record={record}>
							<TextField source="email" />
						</ReferenceField>
					)}
					tertiaryText={(record) => `${record.xrays.length} xrays`}
				/>
			)}
			medium={(
				<Datagrid>
					<TextField source="name" />
					<ReferenceField label="User" source="user.id" reference="users">
						<TextField source="email" />
					</ReferenceField>
					{/* <TextField source="title" />
                    <TextField source="body" /> */}
					<EditButton />
				</Datagrid>
			)}
		/>
	</List>
);

const CaseTitle = ({ record }) => (
	<span>
		Case
		{record ? `"${record.name} by ${record.user.email}"` : ""}
	</span>
);


const CaseFilter = (props) => (
	<Filter {...props}>
		<TextInput label="Search" source="q" alwaysOn />
	</Filter>
);

export const CaseEdit = (props) => (

	<Edit title={<CaseTitle />} {...props}>
		<SimpleForm>
			<TextInput disabled source="id" />
			<ReferenceInput label="User" source="user.id" reference="users" perPage={500}>
				<AutocompleteInput optionText="email" />
			</ReferenceInput>
			<BooleanInput source="isPublic" />
			<TextInput source="name" />
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
	</Edit>
);

export const CaseCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="name" />
			<TextInput multiline source="notes" />
		</SimpleForm>
	</Create>
);
