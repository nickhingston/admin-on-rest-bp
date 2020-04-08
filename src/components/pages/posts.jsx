// in src/posts.js
import React from "react";
import {
	List,
	Edit,
	Create,
	Datagrid,
	ReferenceField,
	TextField,
	EditButton,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
	Filter,
	Responsive,
	SimpleList
} from "react-admin";


export const PostList = (props) => (
	<List {...props} filters={<PostFilter />}>
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
					<ReferenceField label="User" source="user.id" reference="users">
						<TextField source="email" />
					</ReferenceField>
					<TextField source="title" />
					<TextField source="body" />
					<EditButton />
				</Datagrid>
			)}
		/>
	</List>
);

const PostTitle = ({ record }) => (
	<span>
		Post
		{record ? `"${record.title}"` : ""}
	</span>
);


const PostFilter = (props) => (
	<Filter {...props}>
		<TextInput label="Search" source="q" alwaysOn />
		<ReferenceInput label="User" source="user.id" reference="users" allowEmpty>
			<SelectInput optionText="email" />
		</ReferenceInput>
	</Filter>
);

export const PostEdit = (props) => {
	const isAdminUser = JSON.parse(localStorage.user).role === "admin";
	return (

		<Edit title={<PostTitle />} {...props}>
			<SimpleForm>
				<TextInput disabled source="id" />
				{
					isAdminUser
				&& (
					<ReferenceInput label="User" source="user.id" reference="users">
						<SelectInput optionText="name" />
					</ReferenceInput>
				)
				}

				<TextInput source="title" />
				<TextInput multiline source="body" />
			</SimpleForm>
		</Edit>
	);
};

export const PostCreate = (props) => {
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