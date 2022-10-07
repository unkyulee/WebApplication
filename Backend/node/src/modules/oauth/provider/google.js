const rp = require('request-promise-native');
const ObjectID = require('mongodb').ObjectID;
const util = require('../../lib/utility');
const obj = require('object-path');

module.exports.requiresAuthentication = async function requiresAuthentication(db, req, res) {
	return true;
};

module.exports.process = async function process(db, req, res) {
	if (req.query.go) return await go(db, req, res);
	return await collectToken(db, req, res);
};

module.exports.authenticated = async function authenticated(req, res) {
	return;
};

async function collectToken(db, req, res) {
	// check company_id exists
	if (!res.locals.token.sub) {
		res.send('company_id missing');
		res.end();
		return;
	}
	// load server config
	let server = await db.find('server', {});
	if (server && server.length > 0) {
		server = server[0];
	} else {
		res.send('server configuration not found');
		res.end();
		return;
	}
	// load google config
	let config = await db.find('config', {
		query: {
			company_id: ObjectID(res.locals.token.sub),
			type: 'google',
		},
	});
	if (config && config.length > 0) {
		config = config[0];
	} else {
		config = {
			type: 'google',
			company_id: ObjectID(res.locals.token.sub)
		};
	}

	// request for token
	let response = {};
	let form = {
		code: req.query.code,
		client_id: obj.get(server, 'google.client_id'),
		client_secret: obj.get(server, 'google.client_secret'),
		grant_type: 'authorization_code',
		redirect_uri: `${util.getProtocol(req)}://${req.get('host')}/google/`,
	};
	response = await rp({
		method: 'POST',
		uri: 'https://oauth2.googleapis.com/token',
		form,
	});
	response = JSON.parse(response)

	// get google config
	// save the token to the google config

	await db.update('config', {
		...config,
		...response,
	});

	return `<script>window.location='${req.query.state}'</script>`;
}

async function go(db, req, res) {
	// check company_id exists
	if (!res.locals.token.sub) {
		res.send('company_id missing');
		res.end();
		return;
	}
	// load server config
	let server = await db.find('server', {});
	if (server && server.length > 0) {
		server = server[0];
	} else {
		res.send('server configuration not found');
		res.end();
		return;
	}

	let url = `https://accounts.google.com/o/oauth2/v2/auth`;
	let redirect_uri = `${util.getProtocol(req)}://${req.get('host')}/google/`;
	let client_id = obj.get(server, 'google.client_id');
	let scopes =  [
		'openid',
		'email',
		'profile',
		'https://www.googleapis.com/auth/calendar',
		'https://mail.google.com/',
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/drive'
	];
	if(!client_id) {
		res.send('google client_id not found');
		res.end();
		return;
	}

	return `<script>window.location='${url}?response_type=code&client_id=${client_id}&scope=${scopes.join(' ')}&redirect_uri=${redirect_uri}&state=${req.query.go}&access_type=offline&prompt=consent'</script>`;
}
