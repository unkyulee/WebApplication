const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');

module.exports = {
	provider: async function (db, res, req, params) {
		// retrieve email configuration
		let config = await db.find('config', {
			query: {
				type: 'schedule',
				company_id: ObjectID(obj.get(res, 'locals.token.sub', params.company_id)),
			},
		});
		if (config && config.length > 0) {
      params.config = config[0];
		} else {
			throw 'calendar provider failed: schedule Config does not exists';
		}

		// send email depending on the provider
		switch (config.provider) {
      case 'Google':
			default:
			  return require('./provider/google');
		}
	},

	calendars: async function (db, res, req, params) {
		let calendarProvider = await this.provider(db, res, req, params);
		return calendarProvider.calendars(db, res, req, params);
	},

	getEvents: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		return calendarProvider.getEvents(db, res, req, params);
  },

	createEvent: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		return calendarProvider.createEvent(db, res, req, params);
  },

	updateEvent: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		return calendarProvider.updateEvent(db, res, req, params);
  },

	deleteEvent: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		return calendarProvider.deleteEvent(db, res, req, params);
  },
};
