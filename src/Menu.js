// in src/Menu.js
import React, { createElement } from 'react';
import { MenuItemLink, Responsive } from 'react-admin';

import PostIcon from '@material-ui/icons/Forum';
import UserIcon from '@material-ui/icons/Person';
import UsersIcon from '@material-ui/icons/People';
import PlatesIcon from '@material-ui/icons/ViewList';
import CaseIcon from '@material-ui/icons/Inbox';

export default ({ resources, onMenuTap, logout }) => {
	const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === 'admin');
	if (!localStorage.token) {
		return <div>{logout}</div>;
	}
	//console.log("resources:", resources);
	return (
		<div>
			{isAdminUser && <MenuItemLink to="/posts" primaryText="Posts" leftIcon={createElement(PostIcon)} onClick={onMenuTap}/> }
			{isAdminUser && <MenuItemLink to="/users" exact primaryText="Users" leftIcon={createElement(UsersIcon)} onClick={onMenuTap}/> }
			{isAdminUser && <MenuItemLink to="/cases" primaryText="Cases" leftIcon={createElement(CaseIcon)} onClick={onMenuTap}/> }
			{isAdminUser &&	<MenuItemLink to="/plates" primaryText="Plates" leftIcon={createElement(PlatesIcon)} onClick={onMenuTap}/> }
			{<MenuItemLink to={"/users/" + user.id} primaryText="Me" leftIcon={createElement(UserIcon)} onClick={onMenuTap}/> }
			<Responsive xsmall={logout} medium={null} />
		</div>
	)
};