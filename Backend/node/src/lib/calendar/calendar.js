const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');

module.exports = {
	provider: async function (db, res, req, params) {
		let company_id = params.company_id;
		if(!company_id) company_id = obj.get(res, 'locals.token.sub');
		if(!company_id) {
			res.status(500);
			throw 'calendar provider failed: company_id does not exist';
		}

		// retrieve email configuration
		params.config = await db.find('config', {
			query: {
				type: 'schedule',
				company_id: ObjectID(company_id)
			}
		});
		if (params.config && params.config.length > 0) {
      params.config = params.config[0];
		} else {
			throw 'calendar provider failed: schedule Config does not exists';
		}

		// send email depending on the provider

		switch (params.config.provider) {
      case 'Google':
			  return require('./provider/google');
		}
	},

	calendars: async function (db, res, req, params) {
		let calendarProvider = await this.provider(db, res, req, params);
		if(calendarProvider)
			return calendarProvider.calendars(db, res, req, params);
	},

	getEvents: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		if(calendarProvider)
			return calendarProvider.getEvents(db, res, req, params);
  },

	createEvent: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		if(calendarProvider)
			return calendarProvider.createEvent(db, res, req, params);
  },

	updateEvent: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		if(calendarProvider)
			return calendarProvider.updateEvent(db, res, req, params);
  },

	deleteEvent: async function (db, res, req, params) {
    let calendarProvider = await this.provider(db, res, req, params);
		if(calendarProvider)
			return calendarProvider.deleteEvent(db, res, req, params);
  },
};
