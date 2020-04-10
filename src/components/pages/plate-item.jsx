// in src/plates.js
import React from "react";
import {
	List,
	Edit,
	Show,
	Create,
	Datagrid,
	TextField,
	ShowButton,
	EditButton,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
	Filter,
	Responsive,
	TopToolbar
} from "react-admin";

import SVGField from "components/mui/field/SVGField";

export const PlateItemList = (props) => (
	<List title="PlateItems" filters={<PlateItemFilter />} {...props}>
		<Responsive

			medium={(
				<Datagrid>
					<TextField source="id" />
					<TextField source="name" />
					<TextField source="code" />
					<EditButton />
				</Datagrid>
			)}
		/>
	</List>
);

const PlateItemFilter = (props) => (
	<Filter {...props}>
		<TextInput label="Search" source="q" alwaysOn />
		<ReferenceInput label="Plates" source="family" reference="plates" perPage={500} allowEmpty>
			<SelectInput optionText={(record) => (`${record.manufacturer} ${record.familyName}`)} />
		</ReferenceInput>
	</Filter>
);

export const PlateItemTitle = ({ record }) => (
	<span>
		Plate Type:
		{record ? `"${record.name}"` : ""}
	</span>
);

const PlateItemEditActions = ({ basePath }) => (
	<TopToolbar>
		<ShowButton resource="plate-item" basePath={basePath} />
	</TopToolbar>
);

export const PlateItemEdit = (props) => (
	<Edit title={<PlateItemTitle />} actions={<PlateItemEditActions />} {...props}>
		<SimpleForm>
			<ReferenceInput label="Plates" source="family" reference="plates" perPage={500} sort={{ field: "manufacturer", order: "ASC" }} allowEmpty>
				<SelectInput optionText={(record) => (`${record.manufacturer} ${record.familyName}`)} />
			</ReferenceInput>
			<TextInput disabled source="id" fullWidth />
			<TextInput source="name" fullWidth />
			<TextInput source="code" fullWidth />
			<TextInput multiline source="src" fullWidth />
			<SVGField elStyle={{ backgroundColor: "#FFF" }} source="src" />
			<TextInput multiline source="srcFront" fullWidth />
			<SVGField elStyle={{ backgroundColor: "#FFF" }} source="srcFront" />
		</SimpleForm>
	</Edit>
);

export const PlateItemCreate = (props) => {
	const { location } = props;
	const plateId = location.state && location.state.plate;
	return (
		<Create {...props}>
			<SimpleForm>

				<ReferenceInput label="Plates" source="family" reference="plates" defaultValue={plateId} perPage={500}>
					<SelectInput optionText={(record) => (`${record.manufacturer} ${record.familyName}`)} />
				</ReferenceInput>
				<TextInput source="name" />
				<TextInput source="code" />
				<TextInput multiline source="src" />
				<TextInput multiline source="srcFront" />
			</SimpleForm>
		</Create>
	);
};

export const PlateItemShow = (props) => (
	<Show {...props}>
		<SimpleForm>

			<ReferenceInput label="Plates" source="family" reference="plates" perPage={500} allowEmpty>
				<SelectInput optionText={(record) => (`${record.manufacturer} ${record.familyName}`)} />
			</ReferenceInput>


			{/* TODO: why doesnt this work?!

			<ReferenceField label="Plate Family" source="family" reference="plates">
				<TextField source="familyName" />
			</ReferenceField> */}

			<TextField source="id" />
			<TextField source="name" />
			<TextField source="code" />
			<SVGField elStyle={{ backgroundColor: "#FFF" }} source="src" />
			<SVGField elStyle={{ backgroundColor: "#FFF" }} source="srcFront" />
		</SimpleForm>
	</Show>
);
