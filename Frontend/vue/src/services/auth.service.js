import rest from './rest.service.js';
import config from './config.service';
import event from './event.service';

export default {
	client: {},
	isAuthenticated() {
		let isValidAuth = false;

		// check if the token is valid
		let client = localStorage.getItem('client');
		if(client) {
			try {
				client = JSON.parse(client);
				if (client && client.id) {
					isValidAuth = true;
					this.client = client;
				}
			} catch (ex) {
				localStorage.removeItem("client")
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
				`${config.get('host')}/api/public/client`,
				data,
				'get'
			);

			// authenticate
			if(response.status == 200) {
				this.client = response.data.data[0];
				localStorage.setItem('client', JSON.stringify(this.client))

				event.send({name: data});
			}

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
