// in src/accounts.js
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import MuiToolbar from "@material-ui/core/Toolbar";
import {
	List,
	Edit,
	Create,
	Datagrid,
	TextField,
	EditButton,
	TextInput,
	SimpleForm,
	Filter,
	Responsive,
	SimpleList,
	DeleteButton,
	SelectInput,
	ArrayInput,
	showNotification,
	startUndoable as startUndoableAction,
	SaveButton,
	refreshView as refreshViewAction,
	TopToolbar
} from "react-admin";
// import { SaveButton } from "ra-ui-materialui/lib/button";
// import { refreshView as refreshViewAction } from "ra-core";
import { accountAddUser } from "sagas/accountUserSaga";
import { subscriptionUpdate, subscriptionDelete, subscriptionGetPlans } from "sagas/subscriptionSaga";
import BraintreeWrapper from "components/atoms/BraintreeWrapper";
import PaymentMethodField from "components/atoms/PaymentMethodField";
import CostField from "components/atoms/CostField";
import PlainTextField from "components/atoms/PlainTextField";
import AccountUserIterator from "components/molecules/AccountUserIterator";
import countries from "common/countries.json";

export const AccountTitle = () => <span>Account</span>;

export const AccountList = (props) => (
	<List title="Account" filters={<AccountFilter />} {...props}>
		<Responsive
			small={(
				<SimpleList
					primaryText={(record) => record.name}
				/>
			)}
			medium={(
				<Datagrid>
					<TextField source="id" />
					<TextField source="name" />
					<TextField source="contactEmail" />
					<EditButton />
				</Datagrid>
			)}
		/>
	</List>
);

export const AccountShow = () => {};

const AccountFilter = (props) => (
	<Filter {...props}>
		<TextInput label="Search" source="q" alwaysOn />
	</Filter>
);


const AccountEditActions = ({
	basePath, data
}) => (
	<TopToolbar>
		{ data && data.subscription && data.subscription.status !== "Active" && <DeleteButton basePath={basePath} record={data} resource="accounts" /> }
	</TopToolbar>
);


const AccountToolbar = (props) => {
	const { handleSubmitWithRedirect } = props;
	return (
		<MuiToolbar>
			{/* <ToolbarGroup> */}
			<SaveButton handleSubmitWithRedirect={handleSubmitWithRedirect} redirect="edit" />
			{/* </ToolbarGroup> */}
		</MuiToolbar>
	);
};

const setBasePath = (WrappedComponent, path) => (props) => {
	const { record } = props;
	// Notice that we pass through any additional props
	return <WrappedComponent {...props} basePath={path} record={record} />;
};

const EditUserButton = setBasePath(EditButton, "/users");

const AccountEditClass = (props) => {
	const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === "admin");
	const [showUpdatePayment, setUpdatePayment] = useState(false);
	const [frequency, setFrequency] = useState("monthly");
	const costRef = useRef();

	const {
		form,
		admin,
		match,
		plan,
		subscriptionGetPlans
	} = props;

	useEffect(() => {
		subscriptionGetPlans();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addUserEmail = (email) => {
		// TODO: check actually an email!
		accountAddUser(form["record-form"].values, email);
	};

	const complete = () => {
		showNotification("mothership_admin.subscription.succeeded");
		setTimeout(() => {
			refreshViewAction();
		}, 10);
	};

	const account = admin.resources.accounts.data[decodeURIComponent(match.params.id)];
	const subscription = (account && account.subscription) || {};
	const numberOfUsers = ((subscription
		&& subscription.addOns
		&& subscription.addOns.length
		&& subscription.addOns[0].quantity) || 0) + 1;
	const usersChanged = (account
		&& account.users
		&& !showUpdatePayment
		&& numberOfUsers !== account.users.length);

		subscription.status = "Active"
console.log(costRef.current)
	return (
		<>
			<Edit key="account" title={<AccountTitle />} actions={<AccountEditActions isAdminUser={isAdminUser} />} {...props}>
				<SimpleForm autoComplete="nope" toolbar={<AccountToolbar redirect={null} account={account} subscriptionUpdate={subscriptionUpdate} />}>
					{ isAdminUser && <TextInput disabled source="id" /> }
					<TextInput label="Company Name" source="name" />
					<TextInput label="Contact Email" source="contactEmail" />
					<TextInput label="Contact First Name" source="contactFirstName" />
					<TextInput label="Contact Last Name" source="contactLastName" />

					<TextInput label="Flat/Appt no" source="contactAddress.extendedAddress" autoComplete="nope" />
					<TextInput label="Street Address" source="contactAddress.streetAddress" autoComplete="nope" />
					<TextInput label="City" source="contactAddress.locality" />
					<TextInput label="State/County" source="contactAddress.region" />
					<TextInput label="Post Code" source="contactAddress.postalCode" />
					<SelectInput
						label="Country"
						source="contactAddress.countryName"
						choices={countries}
						allowEmpty={false}
						autoComplete="nope"
						resettable
						optionText="title"
						optionValue="title"
					/>

					<h3 key="users-title">Users:</h3>

					<ArrayInput source="users">
						<AccountUserIterator disableAdd>
							<TextInput disabled label=" " source="email" style={{ display: "inline-block", width: "250px" }} fullWidth />
							<SelectInput
								label="Account Role"
								source="accountRole"
								choices={[
									{ id: "admin", name: "Admin" },
									{ id: "user", name: "User" }
								]}
								style={{
									display: "inline-block", minWidth: "100px", width: "100px", marginLeft: "20px"
								}}
							/>
							<EditUserButton
								source="id"
								label="Edit User"
								style={{
									display: "inline-block", minWidth: "100px", width: "120px", marginLeft: "20px", marginTop: "20px"
								}}
							/>
						</AccountUserIterator>
					</ArrayInput>

					<TextInput
						id="add-email-field"
						key="email-field"
						type="email"
						source="email"
						label="Enter new user email"
						style={{ display: "inline-block", minWidth: "250px" }}
						fullWidth
					/>
					<Button
						raised={false}
						color="primary"
						key="add-user-button"
						onClick={() => addUserEmail(document.getElementById("add-email-field").value)}
						style={{ display: "inline-block", margin: "10px" }}
					>
						Add User
					</Button>

				</SimpleForm>

			</Edit>
			<Edit key="subscription" title="Subscription" actions={null} {...props} style={{ paddingTop: "50px" }}>
				<SimpleForm autoComplete="nope" account={account} toolbar={null}>
					{(subscription
				&& (subscription.status === "Active" || subscription.status === "Pending")
				&& (/* (
					<>
						<TextField key="subscription.status" label="Status" source="subscription.status" style={{ display: "inline-block" }} />
						<Button
							key="cancel-btn"
							onClick={() => startUndoableAction(props.subscriptionDelete(account))}
							style={{
								color: "#f44336", display: "inline-block", margin: "10px", marginTop: "20px"
							}}
							raised={false}
						>
							CANCEL
						</Button>
						<PlainTextField key="no-of-users" label="Number of users" text={numberOfUsers.toString()} />
						<TextField key="subscription.nextBillingDate" label="Next Payment Date" source="subscription.nextBillingDate" />
						<TextField key="subscription.nextBillingPeriodAmount" label="Next Payment Amount" source="subscription.nextBillingPeriodAmount" />
						<PaymentMethodField key="last-payment-method" label="Last Payment Method" subscription={subscription} style={{ display: "inline-block", width: "256px" }} />
						<Button
							raised={false}
							key="updatePayment"
							color="primary"
							onClick={() => setUpdatePayment(!showUpdatePayment)}
							style={{ display: "inline-block", margin: "10px", marginTop: "20px" }}
						>
							{showUpdatePayment ? "Hide" : "Change"}
						</Button>
						{/*showUpdatePayment
						&& ((
							<BraintreePaymentForm
								submitButtonText="Update Payment Method"
								key="braintree-dropin-update"
								currency="GBP"
								success={() => {
									showNotification("Update payment successful");
									setTimeout(() => {
										refreshViewAction();
									}, 1000);
								}}
								failure={(err) => {
									console.warn(err);
									showNotification("Update payment failed.", "warning");
								}}
							/>
						) || null)
						{usersChanged
						&& ((
							<CostField
								key="cost-field"
								label="Updated Cost"
								source="frequency"
								plans={plan}
							/>
						)
						|| null)}
						{usersChanged
						&& ((
							<Button
								key="subscription-update"
								variant="contained"
								color="primary"
								onClick={() => subscriptionUpdate(account)}
								raised={false}
							>
								Update
							</Button>
						)
						|| null)}
					</>
				)
				|| */ (
					<>
						<SelectInput
							id="frequency-input"
							key="select-frequency"
							label="Billing Frequency"
							source="frequency"
							choices={[
								{ id: "monthly", name: "Monthly" },
								{ id: "yearly", name: "Yearly" }
							]}
							onChange={(event) => setFrequency(event.target.value)}
						/>
						<CostField key="cost-field" label="Cost" source="frequency" plans={plan} costRef={costRef} />
						{ plan && (
							<BraintreeWrapper
								currency="GBP"
								success={complete}
								frequency={frequency}
								plans={plan}
								userData={account}
								failure={(err) => {
									console.warn(err);
									showNotification("mothership_admin.subscription.failed", "warning");
								}}
							/>)}
					</>
				))
					)}
				</SimpleForm>
			</Edit>
		</>
	);
};

const mapStateToProps = (state) => {
	console.log(state)	
	return { ...state, plan: state.subscriptionPlanObj };
};

export const AccountEdit = connect(mapStateToProps,
	{
		showNotification,
		accountAddUser,
		subscriptionGetPlans,
		subscriptionUpdate,
		subscriptionDelete,
		refreshViewAction,

	})(AccountEditClass);


export const AccountCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="name" label="Company name" />
		</SimpleForm>
	</Create>
);
