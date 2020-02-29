const axios = require('axios');
const config = require('./config');
const obj = require('object-path');

module.exports = {
	request: async function(url, data, method, options) {
		// pass if url is not specified
		if (!url) return null;

		// convert url to full qualified name
		if (url.startsWith('http') == false) {
			if (url.startsWith('/') == false) url = `/${url}`;
			url = `${config.get('host')}${url}`;
		}

		////////////////////////////////////
		switch (method) {
			case 'post':
				return axios.post(url, data, options);

			case 'put':
				return axios.put(url);

			case 'delete':
				return axios.delete(url);

			default:
				return axios.get(url);
		}
	},
};

// Add a request interceptor
axios.interceptors.request.use(
	function(c) {
		// add company_id
		let company_id = config.get('_id');
		if (company_id) obj.set(c, 'headers.company_id', company_id);

		// add token
		let token = config.get('token');
		if (token) obj.set(c, 'headers.authorization', `Bearer ${token}`);

		return c;
	},
	function(error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
axios.interceptors.response.use(
	function(r) {
		// save authorization token
		let token = obj.get(r, 'headers.authorization');
		if (token) {
			token = token.replace('Bearer ', '');
			config.set('token', token);
		} else {
			config.set('token', null);
		}
		return r;
	},
	function(error) {
		// Do something with response error
		return Promise.reject(error);
	}
);
