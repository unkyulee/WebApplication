import rest from './rest.service.js';
import config from './config.service';
import event from './event.service';

export default {
	client: {},
	isAuthenticated() {
		let isValidAuth = false;

		// check if the token is valid
		this.client = localStorage.getItem('client');
		if (this.client) {
			try {
				this.client = JSON.parse(this.client);
				if (this.client.id && this.client.name) {
					isValidAuth = true;
				}
			} catch (ex) {
				console.error(ex);
			}
		}

		// if not valid auth then clear localstorage
		if (!isValidAuth) localStorage.removeItem("client");

		return isValidAuth;
	},

	async authenticate(data) {
		let response = {};
		try {
			response = await rest.request(
				`${config.get('host')}/api/public/login?company_id=${config.get('_id')}`,
				data,
				'post'
			);

			// authenticate
			localStorage.setItem('client', JSON.stringify(response.data))
			event.send({name: data, data: {client: response.data}});

		} catch (e) {
			console.error(e);
			return false;
		}

		return response;
	},

	logout() {
		for (let key of Object.keys(this.client)) delete this.client[key];
		localStorage.clear();
		location.reload();
		//
		event.send({ name: 'data', data: {client: this.client} });
	},
};
