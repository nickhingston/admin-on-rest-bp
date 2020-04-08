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
	SelectInput,
	SimpleForm,
	TextInput,
	Filter,
	Responsive,
	SimpleList,
	ShowButton
} from "react-admin";


export const CaseList = (props) => (
	<List {...props} filters={<CaseFilter />}>
		<Responsive
			small={(
				<SimpleList
					primaryText={(record) => record.title}
					secondaryText={(record) => `${record.views} views`}
					tertiaryText={(record) => new Date(record.published_at).toLocaleDateString()}
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
		<ReferenceInput label="User" source="user.id" reference="users" perPage={500} allowEmpty>
			<SelectInput optionText="email" optionValue="id" />
		</ReferenceInput>
	</Filter>
);

export const CaseEdit = (props) => (

	<Edit title={<CaseTitle />} {...props}>
		<SimpleForm>
			<TextInput disabled source="id" />
			<ReferenceInput label="User" source="user.id" reference="users" perPage={500}>
				<SelectInput optionText="email" />
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

export const CaseCreate = (props) => {
	console.log(props);
	const isAdminUser = JSON.parse(localStorage.user).role === "admin";
	return (
		<Create {...props}>
			<SimpleForm>
				{
					isAdminUser
					&& (
						<ReferenceInput label="User" source="user.id" reference="users" allowEmpty>
							<SelectInput optionText="email" />
						</ReferenceInput>
					)
				}
				<TextInput source="title" />
				<TextInput multiline source="body" />
			</SimpleForm>
		</Create>
	);
};
