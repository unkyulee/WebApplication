import axios from 'axios';
import config from './config.service.js';

export default {
	async request(url, data, method, options) {
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
				return await axios.post(url, data, options);
			case 'put':
				return await axios.put(url, data, options);
			case 'delete':
				return await axios.delete(url);
			default:
				return await axios.get(url);
		}
	},
};
