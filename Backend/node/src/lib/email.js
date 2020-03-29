const ObjectID = require('mongodb').ObjectID;
const rp = require('request-promise-native');
const obj = require('object-path');

module.exports = {
	send: async function(db, res, req, params) {
		// retrieve email configuration
		let config = await db.find('config', {
			query: {
				type: 'email',
				company_id: ObjectID(params.company_id),
			},
		});
		if (config && config.length > 0) {
			config = config[0];
		} else {
			throw 'send failed: email Config does not exists';
		}

		// send email depending on the provider
		if (config.provider == 'Gmail') {
			return await this.Gmail(db, res, req, params, config);
		}
	},

	Gmail: async function(db, res, req, params, config) {
		// retrieve server and get client secrets
		let server = await db.find('server', {});
		if (server.length == 0) {
			throw 'send failed: server config does not found';
		}
		server = server[0];

		// retrieve google config
		let google = await db.find('config', {
			query: {
				type: 'google',
				company_id: ObjectID(params.company_id),
			},
		});
		if (google.length == 0) {
			throw 'send failed: google config does not found';
		}
		google = google[0];

		// retrieve access token
		let token = await rp({
			method: 'POST',
			uri: 'https://oauth2.googleapis.com/token',
			form: {
				grant_type: 'refresh_token',
				client_id: obj.get(server, 'google.client_id'),
				client_secret: obj.get(server, 'google.client_secret'),
				refresh_token: obj.get(google, 'refresh_token'),
			},
		});
		token = JSON.parse(token)

		// send email
		let message = [
			'Content-Type: text/html; charset="UTF-8"\n',
			'MIME-Version: 1.0\n',
			'Content-Transfer-Encoding: 7bit\n',
			'to: ', params.to, '\n',
			'from: ', config.email_from, '\n',
			'subject: ', params.title, '\n\n',
			params.body,
		].join('');
		message = Buffer.from(message, 'utf-8').toString('base64').replace(/\//g,'_').replace(/\+/g,'-')
		//
		let response = await rp({
			method: 'POST',
			uri: 'https://www.googleapis.com/gmail/v1/users/me/messages/send?alt=json',
			headers: {
				Authorization: `Bearer ${token.access_token}`,
			},
			body: {
				raw: message,
			},
			json: true,
		});

		return response;
	},
};
