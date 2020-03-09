const MongoDB = require('../db/mongodb');
const ObjectID = require('mongodb').ObjectID;
var rp = require('request-promise-native');

module.exports = {
	send: async function(db, encryption, company_id, to, subject, body) {
		// retrieve email configuration
		let config = await db.find('config', {
			query: {
				type: 'google',
				company_id: ObjectID(company_id),
			},
		});
		if (config && config.length > 0) {
			config = config[0];
			config.google = encryption.decrypt(config.google);
			config.google = JSON.parse(config.google);
		} else {
			throw 'send failed: email Config does not exists';
		}

		// login to google
		let token = await this.login(config.google_client_id, config.google_client_secret, config.google.refresh_token);

		// send email
		let message = [
			'Content-Type: text/plain; charset="UTF-8"\n',
			'MIME-Version: 1.0\n',
			'Content-Transfer-Encoding: 7bit\n',
			'to: ',
			to,
			'\n',
			'from: ',
			config.email_from,
			'\n',
			'subject: ',
			subject,
			'\n\n',
			body,
    ].join('');

		let response = await rp({
			method: 'POST',
			uri: 'https://www.googleapis.com/gmail/v1/users/me/messages/send?alt=json',
			headers: {
				Authorization: `Bearer ${token.access_token}`,
			},
			body: {
				raw: Buffer.from(message, 'utf-8').toString('base64')
			},
      json: true
    });

    return response;
	},

	///
	login: async function(client_id, client_secret, refresh_token) {
		let response = await rp({
			method: 'POST',
			uri: 'https://oauth2.googleapis.com/token',
			form: {
				grant_type: 'refresh_token',
				client_id,
				client_secret,
				refresh_token,
			},
		});
		return JSON.parse(response);
	},
};
