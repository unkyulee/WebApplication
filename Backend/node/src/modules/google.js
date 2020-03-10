var rp = require('request-promise-native');
const ObjectID = require('mongodb').ObjectID;
const util = require('../lib/utility');

module.exports.requiresAuthentication = async function requiresAuthentication(db, req, res) {
	return true;
};

module.exports.process = async function process(db, req, res) {
	// load integration config
	let config = await db.find('config', {
		query: {
			company_id: ObjectID(res.locals.token.sub),
			type: 'google',
		},
	});
	if (config && config.length > 0) {
		config = config[0];
	} else {
		res.status(404);
		res.end();
		return;
	}

	// request for token
	let response = {};

	let form = {
		code: req.query.code,
		client_id: config.google_client_id,
		client_secret: config.google_client_secret,
		grant_type: 'authorization_code',
		redirect_uri: `${util.getProtocol(req)}://${req.get('host')}/google/`,
	};
	response = await rp({
		method: 'POST',
		uri: 'https://oauth2.googleapis.com/token',
		form,
	});

	// write tokens on config
	config.google = req.app.locals.encryption.encrypt(response);
	await db.update('config', config);

	return `<script>window.location='${req.query.state}'</script>`;
};

module.exports.authenticated = async function authenticated(req, res) {
	return;
};
