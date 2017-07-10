// in src/Menu.js
import React from 'react';
import { MenuItemLink } from 'admin-on-rest';

import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';

function cheese() {
	console.log("baaah")
}

export default ({ resources, onMenuTap, logout }) => {
	let isAdminUser = (localStorage.user ? JSON.parse(localStorage.user).role === 'admin': false);
	console.log("resources:", resources);
	return (
		<div>
			<MenuItemLink to="/posts" primaryText="Posts" onTouchTap={cheese} icon={PostIcon}/>
			{isAdminUser &&
				<MenuItemLink to="/users" primaryText="Users" onTouchTap={cheese} icon={UserIcon}/>
			}
			{logout}
		</div>
	)
};