/* This is because we WANT to change the options param! */
/* eslint-disable no-param-reassign */
import {
	fetchUtils,
	GET_LIST,
	GET_ONE,
	GET_MANY,
	GET_MANY_REFERENCE,
	CREATE,
	UPDATE,
	DELETE
} from "react-admin";

const queryParameters = (query) => {
	if (localStorage.token) {
		query.access_token = localStorage.token;
	}
	return fetchUtils.queryParameters(query);
};

/**
 * Maps admin-on-rest queries to a json-server powered REST API
 *
 * @see https://github.com/typicode/json-server
 * @example
 * GET_LIST     => GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts/123, GET http://my.api.url/posts/456, GET http://my.api.url/posts/789
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts/123
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export default (apiUrl, options, httpClient = fetchUtils.fetchJson) => {
	/**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
	const convertRESTRequestToHTTP = (type, resource, params) => {
		let url = "";
		const restOptions = {};
		switch (type) {
			case GET_LIST: {
				const { page, perPage } = params.pagination;
				const { field, order } = params.sort;
				const query = {
					...params.filter,
					sort: (order === "ASC" ? field : `-${field}`),
					// q:filter,
					page,
					limit: perPage
				};
				url = `${apiUrl}/${resource}?${queryParameters(query)}`;
				break;
			}
			case GET_ONE:
				url = `${apiUrl}/${resource}/${params.id}?${queryParameters({})}`;
				break;
			case GET_MANY_REFERENCE: {
				const { page, perPage } = params.pagination;
				const { field, order } = params.sort;
				const query = {
					...params.filter,
					[params.target]: params.id,
					_sort: field,
					_order: order,
					_start: (page - 1) * perPage,
					_end: page * perPage,
				};
				url = `${apiUrl}/${resource}?${queryParameters(query)}`;
				break;
			}
			case UPDATE: {
				const { id, data, ...rest } = params;
				url = `${apiUrl}/${resource}/${id}?${queryParameters(rest)}`;
				restOptions.method = "PUT";
				restOptions.body = JSON.stringify(data);
				break;
			}
			case CREATE: {
				const query = {};
				const { data } = params;
				if (params.access_token) {
					query.access_token = params.access_token;
				}
				if (resource === "users" && data.cloneFromId) {
					url = `${apiUrl}/${resource}/${data.cloneFromId}/clone?${queryParameters(query)}`;
				}
				else {
					url = `${apiUrl}/${resource}?${queryParameters(query)}`;
				}


				restOptions.method = "POST";
				restOptions.body = JSON.stringify(params.data);
				break;
			}
			case DELETE:
				url = `${apiUrl}/${resource}/${params.id}?${queryParameters({})}`;
				restOptions.method = "DELETE";
				restOptions.body = JSON.stringify(params.data);
				break;
			default:
				throw new Error(`Unsupported fetch action type ${type}`);
		}
		return { url, restOptions };
	};

	/**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} REST response
     */
	const convertHTTPResponseToREST = (response, type, resource, params) => {
		const json = response.json || {};
		// const headers  = response.headers
		switch (type) {
			case GET_LIST:
			case GET_MANY_REFERENCE:
				return {
					data: json.rows,
					total: json.count,
				};
			case CREATE:
				if (resource === "users" && json.user) {
					return { data: { ...params.data, id: json.user.id, token: json.token } };
				}
				return { data: { ...params.data, id: json.id } };
			case DELETE:
				return { data: { id: params.id } }; // no json in DELETE method
			default:
				if (!json.id) {
					if (json.token) { // password-resets doesnt return an id - fix that...
						json.id = json.token;
					}
					else {
						json.id = params.id; // plans does not return an id
					}
				}
				return { data: json };
		}
	};

	/**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     */
	return (type, resource, params) => {
		// json-server doesn't handle WHERE IN requests,
		// so we fallback to calling GET_ONE n times instead
		if (type === GET_MANY) {
			const { id, ...rest } = params;
			return Promise.all(params.ids.map((thisId) => httpClient(`${apiUrl}/${resource}/${thisId}?${queryParameters(rest)}`)))
				.then((responses) => ({ data: responses.map((response) => response.json) }));
		}
		const { url, restOptions } = convertRESTRequestToHTTP(type, resource, params);
		return httpClient(url, restOptions)
			.then((response) => convertHTTPResponseToREST(response, type, resource, params));
	};
};
