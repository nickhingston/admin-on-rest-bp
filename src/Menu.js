// in src/Menu.js
import React from 'react';
import { MenuItemLink } from 'admin-on-rest';

import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';

function onTouchTapFn() {
	// onTouchTap is required in a MenuItemLink - not sure why...
}

export default ({ resources, onMenuTap, logout }) => {
	let isAdminUser = (localStorage.user ? JSON.parse(localStorage.user).role === 'admin': false);
	if (!localStorage.token) {
		return <div>{logout}</div>;
	}
	console.log("resources:", resources);
	return (
		<div>
			<MenuItemLink to="/posts" primaryText="Posts" onTouchTap={onTouchTapFn} icon={PostIcon}/>
			{isAdminUser &&
				<MenuItemLink to="/users" primaryText="Users" onTouchTap={onTouchTapFn} icon={UserIcon}/>
			}
			{logout}
		</div>
	)
};