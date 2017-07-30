import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest';


export default (apiUrl, masterKey) => {

	

	return (type, params) => {
    // called when the user attempts to log in
		if (type === AUTH_LOGIN) {

			var headers = new Headers();
			headers.append('Content-Type', 'application/x-www-form-urlencoded');
			headers.append('authorization', 'Basic ' + (new Buffer(params.username + ':' + params.password).toString('base64')));
			

			var formData = new FormData();
			formData.append('access_token', masterKey);
			formData.append('username', params.username);
			formData.append('password', params.password);

			let options = {
				method: 'POST',
				headers: headers,
				body:'access_token=' + encodeURIComponent(masterKey) +
					'&username=' + encodeURIComponent(params.username) + 
					'&password=' + encodeURIComponent(params.password)
			};

			return fetch(apiUrl + '/auth', options).then(function(response) {
				if (response.status === 201) {
					return response.json();					
				}
				return Promise.reject("Username or password incorrect");
			}).then(function(jsonData) {
				if (jsonData['token']) {
					localStorage.setItem('token', jsonData['token']);
					localStorage.setItem('user', JSON.stringify(jsonData['user']));
					return Promise.resolve();
				}
				return Promise.reject("Auth: Could not decode response object")
			});

		}
		// called when the user clicks on the logout button
		if (type === AUTH_LOGOUT) {
			localStorage.removeItem('token');
			return Promise.resolve();
		}
		// called when the API returns an error
		if (type === AUTH_ERROR) {
			const { status } = params;
			if (status === 401) { // log em out
				localStorage.removeItem('username');
				localStorage.removeItem('token');
				return Promise.reject();
			}
			return Promise.resolve();
		}
		// called when the user navigates to a new location
		if (type === AUTH_CHECK) {
			if (params.resource === 'register' || params.resource === 'password-resets') {
				return Promise.resolve();
			}
 			return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
		}
		return Promise.reject('Unknown method');
	}
};