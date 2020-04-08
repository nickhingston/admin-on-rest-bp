// in src/Menu.js
import React, { createElement } from "react";
import { MenuItemLink, Responsive } from "react-admin";

import PostIcon from "@material-ui/icons/Forum";
import UserIcon from "@material-ui/icons/Person";
import UsersIcon from "@material-ui/icons/People";
import PlatesIcon from "@material-ui/icons/ViewList";
import CaseIcon from "@material-ui/icons/Inbox";
import AccountsIcon from "@material-ui/icons/LibraryBooks";
import AccountIcon from "@material-ui/icons/AccountBalanceWallet";

const Menu = ({ onMenuTap, logout }) => {
	const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === "admin");
	if (!localStorage.token) {
		return <div>{logout}</div>;
	}
	return (
		<div>
			{isAdminUser && <MenuItemLink to="/posts" primaryText="Posts" exact leftIcon={createElement(PostIcon)} onClick={onMenuTap} /> }
			{isAdminUser && <MenuItemLink to="/users" exact primaryText="Users" leftIcon={createElement(UsersIcon)} onClick={onMenuTap} /> }
			{isAdminUser && <MenuItemLink to="/cases" primaryText="Cases" leftIcon={createElement(CaseIcon)} onClick={onMenuTap} /> }
			{isAdminUser &&	<MenuItemLink to="/plates" primaryText="Implants" leftIcon={createElement(PlatesIcon)} onClick={onMenuTap} /> }
			{isAdminUser &&	<MenuItemLink to="/accounts" exact primaryText="Accounts" leftIcon={createElement(AccountsIcon)} onClick={onMenuTap} /> }
			{<MenuItemLink to={`/users/${user.id}`} primaryText="Profile" leftIcon={createElement(UserIcon)} onClick={onMenuTap} /> }
			{user.account && <MenuItemLink to={`/accounts/${user.account}`} primaryText="Account" leftIcon={createElement(AccountIcon)} onClick={onMenuTap} /> }
			<Responsive xsmall={logout} medium={null} />
		</div>
	);
};

export default Menu;
