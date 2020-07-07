const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');
const axios = require('axios');
const moment = require('moment');

module.exports = {
	create: async function (db, res, req, params) {
		// get access token
		let token = await this.getToken(db, res, req, params);

		// create contact
		let response = await axios.post(
			`https://people.googleapis.com/v1/people:createContact`,
			params.contact,
			{ headers: { Authorization: `Bearer ${token.access_token}` }
		});

		return response.data;
	},

	update: async function (db, res, req, params) {
		// get access token
		let token = await this.getToken(db, res, req, params);

		// get contact
		let contact = {};
		try {
			contact = await axios.get(
				`https://people.googleapis.com/v1/${obj.get(params, 'resourceName')}?personFields=names`,
				{
					headers: { Authorization: `Bearer ${token.access_token}` },
				}
			);
			contact = contact.data;
		} catch(ex) {
			console.error(ex.data)
		}


		// update contact
		if(contact.etag) {
			try {
				params.contact.etag = contact.etag;
				let response = await axios.patch(
					`https://people.googleapis.com/v1/${obj.get(params, 'resourceName')}:updateContact?updatePersonFields=names,phoneNumbers`,
					params.contact,
					{ headers: { Authorization: `Bearer ${token.access_token}` }
				});

				return response.data;
			} catch(ex) {
				console.error(ex.response.data)
			}
		}

	},

	getToken: async function (db, res, req, params) {
		// retrieve server and get client secrets
		let server = await db.find('server', {});
		if (server && server.length == 0) {
			throw 'send failed: server config does not found';
		}
		server = server[0];

		// retrieve google config
		let google = await db.find('config', {
			query: {
				type: 'google',
				company_id: ObjectID(obj.get(res, 'locals.token.sub', params.company_id)),
			},
		});
		if (google.length == 0) {
			throw 'google calendar failed: google config does not found';
		}
		google = google[0];

		// retrieve access token
		let token = await axios.post('https://oauth2.googleapis.com/token', {
			grant_type: 'refresh_token',
			client_id: obj.get(server, 'google.client_id'),
			client_secret: obj.get(server, 'google.client_secret'),
			refresh_token: obj.get(google, 'refresh_token'),
		});

		// return the token
		return token.data;
	},
};
