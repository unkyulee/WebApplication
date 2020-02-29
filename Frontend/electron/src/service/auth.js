const { session } = require('electron').remote;
const rest = require('./rest');
const config = require('./config');

module.exports = {
	authenticate: async function(data) {
		// request through REST
		let result = await rest.request(config.get('service_url'), data, 'post');
		// login success
		event.send('login-success');
		return result;
	},
	isAuthenticated: async function() {
		let passed = false;
		// check if there is a token
		let token = config.get('token');
		if (token) {
			// validate the token
			try {
				await this.authenticate();
				passed = true;
			} catch {}
		}

		return passed;
	},
	logout: function() {
		config.set('token', null);
		event.send('logout');
	},
};
