// in src/plates.js
import React, { Component } from "react";
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
	DeleteButton,
	ArrayInput,
	AutocompleteInput,
	TopToolbar
} from "react-admin";
import RecordButton from "components/atoms/recordButton";
import PlateItemIterator from "components/molecules/PlateItemIterator";
// import { EmbeddedArrayField } from 'aor-embedded-array'


export const PlatesList = (props) => {
	return (
		<List title="Plates" filters={<PlatesFilter />} {...props}>
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
						<TextField source="id" />
						<TextField source="familyName" />
						<TextField source="category" />
						<TextField source="manufacturer" />
						<EditButton />
					</Datagrid>
				)}
			/>
		</List>
	);
};

export const PlatesTitle = ({ record }) => (
	<span>
		Plate Type:
		{record ? `"${record.familyName}"` : ""}
	</span>
);


const PlatesFilter = (props) => (
	<Filter {...props}>
		<TextInput label="Search" source="q" alwaysOn />
		{/* <ReferenceInput label="User" source="user.id" reference="users" allowEmpty>
            <SelectInput optionText="email" />
        </ReferenceInput> */}
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
		Add Item
	</FlatButton>
));


const PlatesEditActions = ({
	basePath, data
}) => (
	<TopToolbar>
		<ShowButton basePath={basePath} record={data} />
		<ListButton basePath={basePath} />
		<DeleteButton basePath={basePath} record={data} resource="plates" />
		{/* <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} /> */}
		{/* Add your custom actions */}
		{/* <FlatButton primary label="Add plate" onClick={customAction} /> */}
		<CreatePlateItemButton plateId={data && data.id} />
	</TopToolbar>
);

// const setBasePath = (WrappedComponent) => {

// 	return class extends React.Component {
// 		render() {
// 			const {source, record } = this.props;
// 			const item = get(record, source);
// 		  // Notice that we pass through any additional props
// 		  return <WrappedComponent {...this.props} basePath="/plate-items" record={record}/>;
// 		}
// 	  };
// }

// const ShowButtonPlate = setBasePath(ShowButton);
// const EditButtonPlate = setBasePath(EditButton);

export class PlatesEdit extends Component {
	constructor(props) {
		super(props);
		this.upClick = this.upClick.bind(this);
	}

	upClick(record, items) {
		const i = items.indexOf(record);
		if (i > 0) {
			items.splice(i - 1, 0, items.splice(i, 1)[0]);
		}
		this.setState({});
	}

	render() {
		const { props } = this;
		return (

			<Edit title={<PlatesTitle />} actions={<PlatesEditActions />} {...props}>
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
							<TextInput disabled source="id" style={{ display: "inline-block", margin: "10px" }} />
							<TextInput disabled source="name" style={{ display: "inline-block", margin: "10px" }} />
							<TextInput disabled source="code" style={{ display: "inline-block", margin: "10px" }} />
							<RecordButton source="id" onClick={this.upClick} label="^" style={{ display: "inline-block", margin: "10px" }} />
							<ShowButton basePath="/plate-items" style={{ display: "inline-block", margin: "10px", width: "100px" }} />
							<EditButton basePath="/plate-items" style={{ display: "inline-block", margin: "10px", width: "100px" }} />
						</PlateItemIterator>
					</ArrayInput>

				</SimpleForm>
			</Edit>
		);
	}
}


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
