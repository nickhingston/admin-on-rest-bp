// in src/Menu.js
import React from 'react';
import { MenuItemLink } from 'admin-on-rest';

import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';
import PlatesIcon from 'material-ui/svg-icons/social/group';
import CaseIcon from 'material-ui/svg-icons/social/group';

export default ({ resources, onMenuTap, logout }) => {
	const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === 'admin');
	if (!localStorage.token) {
		return <div>{logout}</div>;
	}
	//console.log("resources:", resources);
	return (
		<div>
			{isAdminUser && <MenuItemLink to="/posts" primaryText="Posts" icon={PostIcon} onClick={onMenuTap}/> }
			{isAdminUser && <MenuItemLink to="/users" primaryText="Users" icon={UserIcon} onClick={onMenuTap}/> }
			{isAdminUser && <MenuItemLink to="/cases" primaryText="Cases" icon={CaseIcon} onClick={onMenuTap}/> }
			{isAdminUser &&	<MenuItemLink to="/plates" primaryText="Plates" icon={PlatesIcon} onClick={onMenuTap}/> }
			{<MenuItemLink to={"/users/" + user.id} primaryText="Me" icon={UserIcon} onClick={onMenuTap}/> }
			{logout}
		</div>
	)
};