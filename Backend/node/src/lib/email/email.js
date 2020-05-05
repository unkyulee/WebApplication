const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');

module.exports = {
	provider: async function (db, res, req, params) {
    let company_id = params.company_id;
		if(!company_id) company_id = obj.get(res, 'locals.token.sub');
		if(!company_id) {
			res.status(500);
			throw 'email provider failed: company_id does not exist';
    }
    
		// retrieve email configuration
		params.config = await db.find('config', {
			query: {
				type: 'email',
				company_id: ObjectID(company_id),
			},
		});
		if (params.config && params.config.length > 0) {
      params.config = params.config[0];
		} else {
			throw 'email provider failed: schedule Config does not exists';
		}

		// send email depending on the provider

		switch (params.config.provider) {
      case 'Gmail':
			  return require('./provider/gmail');
		}
	},

	send: async function (db, res, req, params) {
    let emailProvider = await this.provider(db, res, req, params);
    if(emailProvider)
			return emailProvider.send(db, res, req, params);
	}
};
