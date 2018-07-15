// in src/Menu.js
import React from 'react';
import { MenuItemLink } from 'admin-on-rest';

import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';
import PlatesIcon from 'material-ui/svg-icons/social/group';
import CaseIcon from 'material-ui/svg-icons/social/group';

function onTouchTapFn() {
	// onTouchTap is required in a MenuItemLink - not sure why...
}

export default ({ resources, onMenuTap, logout }) => {
	const user = localStorage.user && JSON.parse(localStorage.user);
	const isAdminUser = (user && user.role === 'admin');
	if (!localStorage.token) {
		return <div>{logout}</div>;
	}
	//console.log("resources:", resources);
	return (
		<div>
			{isAdminUser && <MenuItemLink to="/posts" primaryText="Posts" onTouchTap={onTouchTapFn} icon={PostIcon}/> }
			{isAdminUser && <MenuItemLink to="/users" primaryText="Users" onTouchTap={onTouchTapFn} icon={UserIcon}/> }
			{isAdminUser && <MenuItemLink to="/cases" primaryText="Cases" onTouchTap={onTouchTapFn} icon={CaseIcon}/> }
			{isAdminUser &&	<MenuItemLink to="/plates" primaryText="Plates" onTouchTap={onTouchTapFn} icon={PlatesIcon}/> }
			{<MenuItemLink to={"/users/" + user.id} primaryText="Me" onTouchTap={onTouchTapFn} icon={UserIcon}/> }
			{logout}
		</div>
	)
};