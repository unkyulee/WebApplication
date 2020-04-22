const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');
const axios = require('axios');
const moment = require('moment');

module.exports = {
	calendars: async function (db, res, req, params) {
		// get access token
		let token = await this.getToken(db, res, req, params);
		// get list of calendars
		let calendars = await axios.get(
			`https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner`,
			{
				headers: { Authorization: `Bearer ${token.access_token}` },
			}
		);

		return obj.get(calendars.data, 'items', []);
	},

	getEvents: async function (db, res, req, params) {
		// get access token
		let token = await this.getToken(db, res, req, params);
	},

	createEvent: async function (db, res, req, params) {
		// error check
		if (
			!obj.get(params, 'config.calendar') ||
			!obj.get(params, 'event.appointment_date') ||
			!obj.get(params, 'event.appointment_end_date')
		) {
			return;
		}

		// get access token
		let token = await this.getToken(db, res, req, params);
		// see if the calendar is specified
		if (obj.get(params, 'config.calendar') && obj.get(params, 'event')) {
			// create an event to the calendar
			let data = {
				start: { dateTime: moment(obj.get(params, 'event.appointment_date')).format('YYYY-MM-DDTHH:mm:ssZZ') },
				end: {
					dateTime: moment(obj.get(params, 'event.appointment_end_date')).format('YYYY-MM-DDTHH:mm:ssZZ'),
				},
				summary: obj.get(params, 'event.title'),
				description: obj.get(params, 'event.note'),
			};

			if (obj.get(params, 'event.assignees', []).length > 0) {
				let assignees = obj.get(params, 'event.assignees', []);
				data.attendees = [];
				for (let assignee of assignees) {
					if (assignee.email) {
						data.attendees.push({
							displayName: assignee.name,
							email: assignee.email,
						});
					}
				}
			}

			let url = `https://www.googleapis.com/calendar/v3/calendars/${obj.get(params, 'config.calendar')}/events`;
			// sendUpdates - all, externalOnly, none
			if (params.sendUpdates) url += `?sendUpdates=${params.sendUpdates}`;
			let response = await axios.post(url, data, { headers: { Authorization: `Bearer ${token.access_token}` } });
			//
			return response.data;
		}
	},

	updateEvent: async function (db, res, req, params) {
		// error check
		if (
			!obj.get(params, 'config.calendar') ||
			!obj.get(params, 'event.appointment_date') ||
			!obj.get(params, 'event.appointment_end_date') ||
			!obj.get(params, 'event.event.id')
		) {
			return;
		}

		// get access token
		let token = await this.getToken(db, res, req, params);
		// see if the calendar is specified
		if (obj.get(params, 'config.calendar') && obj.get(params, 'event') && obj.get(params, 'event.event.id')) {
			// create an event to the calendar
			let data = {
				start: { dateTime: moment(obj.get(params, 'event.appointment_date')).format('YYYY-MM-DDTHH:mm:ssZZ') },
				end: {
					dateTime: moment(obj.get(params, 'event.appointment_end_date')).format('YYYY-MM-DDTHH:mm:ssZZ'),
				},
				summary: obj.get(params, 'event.title'),
				description: obj.get(params, 'event.note'),
			};

			if (obj.get(params, 'event.assignees', []).length > 0) {
				let assignees = obj.get(params, 'event.assignees', []);
				data.attendees = [];
				for (let assignee of assignees) {
					if (assignee.email) {
						data.attendees.push({
							displayName: assignee.name,
							email: assignee.email,
						});
					}
				}
			}

			let url = `https://www.googleapis.com/calendar/v3/calendars/${obj.get(
				params,
				'config.calendar'
			)}/events/${obj.get(params, 'event.event.id')}`;

			// sendUpdates - all, externalOnly, none
			if (params.sendUpdates) url += `?sendUpdates=${params.sendUpdates}`;

			// send the response
			let response = await axios.put(url, data, { headers: { Authorization: `Bearer ${token.access_token}` } });

			return response.data;
		}
	},

	deleteEvent: async function (db, res, req, params) {
		// get access token
		let token = await this.getToken(db, res, req, params);

		// see if the calendar is specified
		if (obj.get(params, 'config.calendar') && obj.get(params, 'event') && obj.get(params, 'event.event.id')) {
			let response = await axios.delete(
				`https://www.googleapis.com/calendar/v3/calendars/${obj.get(
					params,
					'config.calendar'
				)}/events/${obj.get(params, 'event.event.id')}`,
				{ headers: { Authorization: `Bearer ${token.access_token}` } }
			);
			return response.data;
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
