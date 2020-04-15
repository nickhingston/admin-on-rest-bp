// in src/accounts.js
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, ButtonGroup } from "@material-ui/core";
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
	SelectInput,
	ArrayInput,
	showNotification as showNotificationAction,
	startUndoable as startUndoableAction,
	SaveButton,
	refreshView as refreshViewAction
} from "react-admin";
// import { SaveButton } from "ra-ui-materialui/lib/button";
// import { refreshView as refreshViewAction } from "ra-core";
import { accountAddUser } from "sagas/accountUserSaga";
import {
	subscriptionUpdate as subscriptionUpdateAction,
	subscriptionDelete as subscriptionDeleteAction,
	subscriptionGetPlans as subscriptionGetPlansAction
} from "sagas/subscriptionSaga";
import BraintreeWrapper from "components/atoms/BraintreeWrapper";
import PaymentMethodField from "components/atoms/PaymentMethodField";
import CostField from "components/atoms/CostField";
import PlainTextField from "components/atoms/PlainTextField";
import AccountUserIterator from "components/molecules/AccountUserIterator";
import countries from "common/countries.json";
import TableViewCell from "components/atoms/TableViewCell";

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
	const [frequency, _setFrequency] = useState("monthly");

	const {
		form,
		admin,
		match,
		plan,
		subscriptionGetPlans,
		showNotification,
		subscriptionUpdate,
		subscriptionDelete
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

	const setFrequency = (ev) => {
		const button = ev.target.tagName === "SPAN" ? ev.target.parentNode : ev.target;
		_setFrequency(button.dataset.frequency);
	};

	const sanitizeEditProps = ({
		registrationObj,
		// eslint-disable-next-line no-shadow
		accountAddUser,
		// eslint-disable-next-line no-shadow
		subscriptionGetPlans,
		// eslint-disable-next-line no-shadow
		subscriptionUpdate,
		// eslint-disable-next-line no-shadow
		subscriptionDelete,
		// eslint-disable-next-line no-shadow
		showNotification,
		subscriptionPlanObj,
		passwordResetObj,
		refreshView,
		...rest
	}) => rest;

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

	return (
		<>
			<Edit title={<AccountTitle />} {...sanitizeEditProps(props)}>
				<SimpleForm autoComplete="off" toolbar={<AccountToolbar redirect={null} account={account} subscriptionUpdate={subscriptionUpdate} />}>
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

					<ArrayInput source="users" label="Users">
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
						color="primary"
						variant="outlined"
						key="add-user-button"
						onClick={() => addUserEmail(document.getElementById("add-email-field").value)}
					>
						Add User
					</Button>

					{((subscription
				&& (subscription.status === "Active" || subscription.status === "Pending")
				&& (
					<TableViewCell caption="SUBSCRIPTION">
						<TableViewCell>
							<ButtonGroup fullWidth>
								<PlainTextField label="Status" text={subscription.status} />
								<Button
									key="cancel-btn"
									onClick={() => startUndoableAction(subscriptionDelete(account))}
									variant="outlined"
									color="secondary"
								>
									CANCEL
								</Button>
							</ButtonGroup>
						</TableViewCell>
						<TableViewCell>
							<PlainTextField label="Number of users" text={numberOfUsers.toString()} />
							<PlainTextField label="Next Payment Date" text={subscription.nextBillingDate} />
							<PlainTextField klabel="Next Payment Amount" text={subscription.nextBillingPeriodAmount} />
							<PaymentMethodField key="last-payment-method" label="Last Payment Method" subscription={subscription} style={{ display: "inline-block", width: "256px" }} />
							<Button
								key="updatePayment"
								color="primary"
								onClick={() => setUpdatePayment(!showUpdatePayment)}
								variant="outlined"
							>
								{showUpdatePayment ? "Hide" : "Change"}
							</Button>
							{showUpdatePayment
							&& ((
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
								/>
							) || null) }
						</TableViewCell>
						{usersChanged
						&& ((
							<TableViewCell>
								{ plan && (
									<CostField
										key="cost-field"
										label="Updated Cost"
										frequency={frequency}
										record={account}
										plans={plan}
									/>
								)}
								<Button
									key="subscription-update"
									variant="contained"
									color="primary"
									onClick={() => subscriptionUpdate(account)}
								>
									Update
								</Button>
							</TableViewCell>
						)
						|| null)}
					</TableViewCell>
				))
				|| (
					<>
						<TableViewCell
							caption="subscription"
							border={0}
							title={(
								<span>
									vPOP
									<sup>PRO</sup>
								</span>
							)}
							body={(
								<ButtonGroup fullWidth>
									<Button color="primary" variant={frequency === "monthly" ? "contained" : "outlined"} source="frequency" data-frequency="monthly" onClick={setFrequency}>Monthly</Button>
									<Button color="primary" variant={frequency === "yearly" ? "contained" : "outlined"} source="frequency" data-frequency="yearly" onClick={setFrequency}>Annual</Button>
								</ButtonGroup>
							)}
						/>
						<TableViewCell
							caption={`${frequency === "monthly" ? "monthly" : "annual"} subscription`}
							border={0}
							title={(
								<span>
									vPOP
									<sup>PRO</sup>
								</span>
							)}
							body={plan && <CostField key="cost-field" label="Cost" frequency={frequency} record={account} plans={plan} />}
						/>
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
							/>
						)}
					</>
				))}
				</SimpleForm>
			</Edit>
		</>
	);
};

const mapStateToProps = (state) => ({ ...state, plan: state.subscriptionPlanObj });

export const AccountEdit = connect(mapStateToProps,
	{
		accountAddUser,
		subscriptionGetPlans: subscriptionGetPlansAction,
		subscriptionUpdate: subscriptionUpdateAction,
		subscriptionDelete: subscriptionDeleteAction,
		refreshView: refreshViewAction,
		showNotification: showNotificationAction
	})(AccountEditClass);


export const AccountCreate = (props) => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="name" label="Company name" />
		</SimpleForm>
	</Create>
);
