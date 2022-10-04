// @ts-nocheck
import axios from 'axios';
import config from './config.service.ts';

export default {
	async request(url, data = {}, method, options) {
		// pass if url is not specified
		if (!url) return null;

		// convert url to full qualified name
		if (url.startsWith('http') == false) {
			if (url.startsWith('/') == false) url = `/${url}`;
			url = `${config.get('host')}${url}`;
		}

		////////////////////////////////////
		try {
			switch (method) {
				case 'post':
					return await axios.post(url, data, options);
				case 'put':
					return await axios.put(url, data, options);
				case 'delete':
					return await axios.delete(url);
				default: {
					let queryString = Object.keys(data)
						.map((key) => key + '=' + data[key])
						.join('&');
					let queryUrl = url;
					if (queryUrl.includes('?') == false) queryUrl = `${url}?${queryString}`;
					else queryUrl = `${url}&${queryString}`;
					return await axios.get(queryUrl);
				}
			}
		} catch (ex) {
			return ex.response;
		}
	},
};


// Add a request interceptor
axios.interceptors.request.use(function(req) {
	try {
		req.headers['company_id'] = config.get('_id');
	} catch(ex) {
		console.error(ex)
	}
	return req;
});
