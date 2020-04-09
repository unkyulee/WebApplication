const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');
const axios = require('axios');

module.exports = {
	calendars: async function (db, res, req, params) {
		// get list of
		let token = await this.getToken(db, res, req, params);
		// get list of calendars
		let calendars = await axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner`, {
			headers: { Authorization: `Bearer ${token.access_token}` },
		});

		return obj.get(calendars.data, 'items', []);
	},

	getEvents: async function (db, res, req, params) {},

	createEvent: async function (db, res, req, params) {},

	updateEvent: async function (db, res, req, params) {},

	deleteEvent: async function (db, res, req, params) {},

	getToken: async function (db, res, req, params) {
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
