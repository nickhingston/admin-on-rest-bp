// in src/plates.js
import React, { Component } from 'react';

import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import get from 'lodash.get';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import RecordButton from './recordButton'
import { EmbeddedArrayField } from 'aor-embedded-array'
import { 
	List, 
	Edit, 
	Create, 
	Datagrid, 
	TextField, 
	EditButton, 
	DisabledInput, 
	SimpleForm, 
	TextInput, 
	BooleanInput,
	Filter,
	Responsive,
	SimpleList,
	ShowButton,
	ListButton,
	DeleteButton,
	AutocompleteInput,
	 
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


const CreatePlateItemButton = connect(null, {push: push })((props) => (
	<FlatButton primary label="Add item" onClick={() => {
		props.push("/plate-items/create", {plate: props.plateId});
	}
	}/>
));



const PlatesEditActions = ({ basePath, data, refresh, history }) => (
    <CardActions >
        <ShowButton basePath={basePath} record={data} />
        <ListButton basePath={basePath} />
        <DeleteButton basePath={basePath} record={data} />
        <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
        {/* Add your custom actions */}
        {/* <FlatButton primary label="Add plate" onClick={customAction} /> */}
		<CreatePlateItemButton plateId={data && data.id}/>
    </CardActions>
);

const passParentRecord = (WrappedComponent) => {
	
	return class extends React.Component {
		render() {
		  // Notice that we pass through any additional props
		  return <WrappedComponent {...this.props} parentRecord={this.props.record} meta={{touched:false, error:null}}/>;
		}
	  };
}

const EmbeddedArrayFieldWithParent = passParentRecord(EmbeddedArrayField);

const setBasePath = (WrappedComponent) => {
	
	return class extends React.Component {
		render() {
			const {source, record } = this.props;
			const item = get(record, source);
		  // Notice that we pass through any additional props
		  return <WrappedComponent {...this.props} basePath="/plate-items" record={item}/>;
		}
	  };
}

const ShowButtonPlate = setBasePath(ShowButton);
const EditButtonPlate = setBasePath(EditButton);

export class PlatesEdit extends Component {
	constructor(props) {
		super(props);
		this.upClick = this.upClick.bind(this);
	}
	upClick(record) {
		console.log(record)
		console.log(this.plateFamilyRecord)
		let i = this.plateFamilyRecord.items.indexOf(record)
		if (i > 0) {
			let items = [...this.plateFamilyRecord.items];
			items.splice(i-1, 0, items.splice(i, 1)[0]);
			this.plateFamilyRecord.items = items;
		}
		this.setState({})
	}
	render() {
		const {props} = this;
		return (

			<Edit title={<PlatesTitle />} actions={<PlatesEditActions />}  {...props}>
				<SimpleForm>
					<DisabledInput source="id" />	
					<TextInput source="familyName" />
					<TextInput source="category" />
					<TextInput source="manufacturer" />
					<TextInput source="defaultItemIndex" />
					<AutocompleteInput source="publishState" options={{ filter: (item) => item }} choices={[
						{ id: 'test', name: 'Test' },
						{ id: 'published', name: 'Published' },
						{ id: 'removed', name: 'Removed' },
					]} />
					<BooleanInput source="flippable" />
					<TextInput source="flipAxis" />
					
					<EmbeddedArrayFieldWithParent source="items" ref={(ref) => this.plateFamilyRecord = (ref && ref.props.record)}>	
							<TextField source="id" style={{display: "inline-block", margin:"10px"}}/>
							<TextField source="name" style={{display: "inline-block", margin:"10px"}}/>
							<TextField source="code" style={{display: "inline-block", margin:"10px"}}/>
							<RecordButton onClick={this.upClick} label="^" style={{display: "inline-block", margin:"10px"}}/>
							<ShowButtonPlate basePath="/plate-items" style={{display: "inline-block", margin:"10px"}}/>
							<EditButtonPlate style={{display: "inline-block", margin:"10px"}}/>
					</EmbeddedArrayFieldWithParent>
					
				</SimpleForm>
			</Edit>
			)
	}
}


export const PlatesCreate = (props) => {
	
	return (
		<Create {...props}>
			<SimpleForm>
				<TextInput source="familyName" />
				<TextInput source="category" />
				<TextInput source="manufacturer" />
				<TextInput source="defaultItemIndex" defaultValue="0" />
				<AutocompleteInput source="publishState" defaultValue="test" options={{ filter: (item) => item }} choices={[
					{ id: 'test', name: 'Test' },
					{ id: 'published', name: 'Published' },
					{ id: 'removed', name: 'Removed' },
				]} />
				<BooleanInput source="flippable" />
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