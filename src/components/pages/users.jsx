// in src/users.js
import React from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import {
	TopToolbar,
	Create,
	Edit,
	List,
	Responsive,
	SimpleForm,
	SimpleList,
	Filter,
	TextInput,
	Datagrid,
	EmailField,
	TextField,
	ImageField,
	EditButton,
	CloneButton,
	DateInput,
	SelectInput,
	Toolbar,
	SaveButton,
	ExportButton,
	CreateButton,
	RefreshButton,
	downloadCSV
} from "react-admin";
import { withStyles } from "@material-ui/core/styles";
import { unparse as convertToCSV } from "papaparse/papaparse.min";
import { get } from "lodash";


import BraintreePaymentForm from "components/atoms/BraintreePaymentForm";

const validateUserSave = (val) => {
	const values = val;
	const errors = {};
	if (!values.trialEnd) {
		errors.trialEnd = ["TrialEnd is required"];
	}
	else {
		values.trialEnd = values.trialEnd.valueOf();
	}

	return errors;
};

const sifStyle = {
	image: {
		maxHeight: "2rem"
	}
};

const SmallImageField = withStyles(sifStyle)(({ classes, ...props }) => (
	<ImageField classes={classes} {...props} />
));

const SubscriptionStatusField = ({ source, record = {} }) => {
	const subscription = get(record, source);
	const account = get(record, "account");
	let text = "None";
	if (subscription) {
		if (subscription.status) {
			text = `${subscription.status} (${subscription.id})`;
		}
		else {
			// apple?
			text = `apple (${subscription.expirationDate})`;
		}
	}
	else if (account) {
		text = `Account (${account})`;
	}
	return <span>{text}</span>;
};

const usersExporter = (data) => {
	const users = data.map((user) => {
		const { subscription, ...userForExport } = user;
		let text = "None";
		let expirationDate = "";
		if (subscription) {
			if (subscription.status) {
				text = `${subscription.status} (${subscription.id})`;
			}
			else {
				// apple?
				text = "apple";
				expirationDate = new Date(subscription.expirationDate);
			}
		}
		else if (user.trialPeriodRemaining) {
			text = "Trial";
			expirationDate = new Date(user.trialEnd);
		}
		else if (user.account) {
			text = `Account (${user.account})`;
		}
		userForExport.subscription = text;
		userForExport.expirationDate = expirationDate;
		return userForExport;
	});

	const csv = convertToCSV({
		data: users,
		fields: ["id", "email", "firstName", "lastName", "subscription", "expirationDate", "role", "accountRole", "account"]
	});
	downloadCSV(csv, "users");
};

const UserListActions = ({
	basePath,
	currentSort,
	filterValues,
	resource,
	total
}) => (
	<TopToolbar>
		<CreateButton basePath={basePath} />
		<ExportButton
			disabled={total === 0}
			resource={resource}
			sort={currentSort}
			filter={filterValues}
			exporter={usersExporter}
			maxResults={10000}
		/>
		<RefreshButton />
	</TopToolbar>
);


export const UserList = (props) => (
	<List title="All users" filters={<UserFilter />} actions={<UserListActions />} bulkActionButtons={false} {...props}>
		<Responsive
			small={(
				<SimpleList
					primaryText={(record) => record.email}
				/>
			)}
			medium={(
				<Datagrid>
					<SmallImageField source="picture" style={{ image: { backgroundColor: "black", height: "2rem" } }} />
					<TextField source="id" />
					<EmailField source="email" />
					<SubscriptionStatusField source="subscription" />
					<TextField source="role" />
					<EditButton />
				</Datagrid>
			)}
		/>
	</List>
);


const UserEmail = ({ record }) => <span>{record.email}</span>;

const CreateAccountButton = connect(null, { push })((props) => (
	<Button
		color="primary"
		variant="contained"
		onClick={() => {
			props.push("/accounts/create", { user: props.userId });
		}}
		size="small"
	>
		Create Organisation
	</Button>
));

const ViewAccountButton = connect(null, { push })((props) => (
	<Button
		color="primary"
		variant="outlined"
		onClick={() => {
			props.push(`/accounts/${props.accountId}`, { user: props.userId });
		}}
		size="small"
	>
		Show Organisation
	</Button>
));

const UserEditActions = ({
	basePath, data
}) => {
	const { account } = data || {};
	const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === "admin");
	const cloneData = { ...data, cloneFromId: (data && data.id) || null };
	return (
		<TopToolbar>
			{ !account && <CreateAccountButton userId={data && data.id} /> }
			{ account && <ViewAccountButton accountId={account} /> }
			{ isAdminUser && <CloneButton basePath={basePath} record={cloneData} /> }
		</TopToolbar>
	);
};

const UserEditToolbar = (props) => (
	<Toolbar {...props}>
		<SaveButton
			redirect={false}
			submitOnEnter
		/>
		{/* no delete button! */}
	</Toolbar>
);


export const UserEdit = (props) => {
	const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === "admin");
	const account = user && user.account;
	return (
		<Edit title={<UserEmail />} actions={<UserEditActions />} {...props}>
			<SimpleForm validate={validateUserSave} toolbar={<UserEditToolbar />}>
				{ isAdminUser && <ImageField source="picture" /> }
				{ isAdminUser && <TextInput disabled source="id" /> }
				<TextInput disabled source="email" />
				<TextInput source="title" />
				<TextInput label="First Name" source="firstName" />
				<TextInput label="Last Name" source="lastName" />
				{ isAdminUser && (
					<SelectInput
						label="Role"
						source="role"
						choices={[
							{ id: "admin", name: "Admin" },
							{ id: "user", name: "User" }
						]}
					/>
				)}
				{ isAdminUser && <DateInput source="trialEnd" parse={(d) => new Date(d).valueOf()} /> }
				{ isAdminUser && <TextInput source="subscription.id" disabled /> }
				{ isAdminUser && <TextInput source="subscription.status" disabled /> }
				{ account && (
					<SelectInput
						label="Account Role"
						source="accountRole"
						choices={[
							{ id: "admin", name: "Admin" },
							{ id: "user", name: "User" }
						]}
					/>
				) }
				{ false && !account && (
					<BraintreePaymentForm
						currency="GBP"
						total="12.50"
						success={(a) => {
							console.log("complete:", a);
						}}
					/>
				)}
			</SimpleForm>
		</Edit>
	);
};

const UserFilter = (props) => (
	<Filter {...props}>
		<TextInput label="Search" source="q" alwaysOn />
	</Filter>
);

export const UserCreate = (props) => {
	const isAdminUser = JSON.parse(localStorage.user).role === "admin";
	if (!isAdminUser) {
		return null;
	}
	return (
		<Create {...props}>
			<SimpleForm>
				<TextInput source="title" />
				<TextInput source="email" />
				<TextInput source="firstName" />
				<TextInput source="lastName" />
				<TextInput source="password" type="password" />
				<DateInput source="trialEnd" parse={(d) => new Date(d).valueOf()} />
			</SimpleForm>
		</Create>
	);
};
