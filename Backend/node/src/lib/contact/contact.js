const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');

module.exports = {
	provider: async function (db, res, req, params) {
		let company_id = params.company_id;
		if(!company_id) company_id = obj.get(res, 'locals.token.sub');
		if(!company_id) {
			res.status(500);
			throw 'contact provider failed: company_id does not exist';
		}

		// retrieve email configuration
		params.config = await db.find('config', {
			query: {
				type: 'client',
				company_id: ObjectID(company_id)
			}
		});
		if (params.config && params.config.length > 0) {
      params.config = params.config[0];
		} else {
			throw 'contact provider failed: contact config does not exists';
		}

		// send email depending on the provider
		switch (params.config.provider) {
      case 'Google':
			  return require('./provider/google');
		}
	},

	create: async function (db, res, req, params) {
		let contactProvider = await this.provider(db, res, req, params);
		if(contactProvider)
			return contactProvider.create(db, res, req, params);
	},

	update: async function (db, res, req, params) {
		let contactProvider = await this.provider(db, res, req, params);
		if(contactProvider)
			return contactProvider.update(db, res, req, params);
	},

};
