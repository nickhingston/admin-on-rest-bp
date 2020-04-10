// in src/plates.js
import React from "react";
import FlatButton from "@material-ui/core/Button";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import {
	List,
	Edit,
	Create,
	Datagrid,
	TextField,
	EditButton,
	SimpleForm,
	TextInput,
	BooleanInput,
	Filter,
	Responsive,
	SimpleList,
	ShowButton,
	ListButton,
	ArrayInput,
	AutocompleteInput,
	TopToolbar
} from "react-admin";
// import RecordButton from "components/atoms/recordButton";
import PlateItemIterator from "components/molecules/PlateItemIterator";
// import { EmbeddedArrayField } from 'aor-embedded-array'


export const PlatesList = (props) => (
	<List
		title="Plates"
		filters={<PlatesFilter />}
		bulkActionButtons={false}
		{...props}
		sort={{ field: "manufacturer", order: "ASC" }}
	>
		<Responsive
			small={(
				<SimpleList
					primaryText={(record) => `${record.manufacturer} ${record.familyName}`}
					secondaryText={(record) => record.id}
					tertiaryText={(record) => `${record.items.length} variants`}
				/>
			)}
			medium={(
				<Datagrid>
					<TextField source="manufacturer" />
					<TextField source="familyName" />
					<TextField source="category" />
					<TextField source="id" />
					<EditButton />
				</Datagrid>
			)}
		/>
	</List>
);

export const PlatesTitle = ({ record }) => (
	<span>
		Plate Type:
		{record ? `"${record.familyName}"` : ""}
	</span>
);


const PlatesFilter = (props) => (
	<Filter {...props}>
		<TextInput label="Search" source="q" alwaysOn />
	</Filter>
);


const CreatePlateItemButton = connect(null, { push })((props) => (
	<FlatButton
		color="primary"
		label="Add item"
		onClick={() => {
			props.push("/plate-items/create", { plate: props.plateId });
		}}
	>
		<span>Add Item</span>
	</FlatButton>
));


const PlatesEditActions = ({
	basePath, data
}) => (
	<TopToolbar>
		<ListButton basePath={basePath} />
		{/* <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} /> */}
		{/* Add your custom actions */}
		{/* <FlatButton primary label="Add plate" onClick={customAction} /> */}
		<CreatePlateItemButton plateId={data && data.id} />
	</TopToolbar>
);

/* const upClick = (record, items) => {
	console.log(record, items)
	const i = items.indexOf(record);
	if (i > 0) {
		items.splice(i - 1, 0, items.splice(i, 1)[0]);
	}
}; */

export const PlatesEdit = (props) => (
	<Edit
		title={<PlatesTitle />}
		actions={<PlatesEditActions />}
		{...props}
	>
		<SimpleForm>
			<TextInput disabled source="id" />
			<TextInput source="familyName" />
			<TextInput source="category" />
			<TextInput source="manufacturer" />
			<TextInput source="defaultItemIndex" />
			<AutocompleteInput
				source="publishState"
				choices={[
					{ id: "test", name: "Test" },
					{ id: "published", name: "Published" },
					{ id: "removed", name: "Removed" },
				]}
			/>
			<BooleanInput source="flippable" />
			<TextInput source="flipAxis" />
			<ArrayInput source="items">
				<PlateItemIterator disableAdd>
					<TextInput disabled source="id" style={{ display: "block", margin: "10px" }} />
					<TextInput disabled source="name" style={{ display: "block", margin: "10px" }} />
					<TextInput disabled source="code" style={{ display: "block", margin: "10px" }} />
					{/* This doesn't work in the old version of Admin
						and can't think how to make it work here - maybe react sortable?
						<RecordButton source="id" onClick={upClick}
						label="^" style={{ display: "block", margin: "10px" }} /> */}
					<ShowButton
						basePath="/plate-items"
						style={{
							display: "block",
							margin: "10px",
							width: "150px",
							whiteSpace: "nowrap"
						}}
					/>
					<EditButton
						basePath="/plate-items"
						style={{
							display: "block",
							margin: "10px",
							width: "150px",
							whiteSpace: "nowrap"
						}}
					/>
				</PlateItemIterator>
			</ArrayInput>

		</SimpleForm>
	</Edit>
);


export const PlatesCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="familyName" />
			<TextInput source="category" />
			<TextInput source="manufacturer" />
			<TextInput source="defaultItemIndex" defaultValue="0" />
			<AutocompleteInput
				source="publishState"
				defaultValue="test"
				options={{ filter: (item) => item }}
				choices={[
					{ id: "test", name: "Test" },
					{ id: "published", name: "Published" },
					{ id: "removed", name: "Removed" },
				]}
			/>
			<BooleanInput source="flippable" />
			<TextInput source="flipAxis" />
		</SimpleForm>
	</Create>
);


export const PlateItemsList = () => (
	<Datagrid>
		<TextInput disabled source="items[0].id" />
		<TextField source="name" />
		<TextField source="category" />
		<TextField source="code" />
		<EditButton />
	</Datagrid>
);
