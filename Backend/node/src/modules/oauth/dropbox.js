const rp = require('request-promise-native');
const ObjectID = require('mongodb').ObjectID;
const util = require('../lib/utility');
const obj = require('object-path');

module.exports.requiresAuthentication = async function requiresAuthentication(db, req, res) {
	return true;
};

module.exports.authenticated = async function authenticated(req, res) {
	return;
};

module.exports.process = async function process(db, req, res) {
	if (req.query.go) return await go(db, req, res);
	return await collectToken(db, req, res);
};

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

	let url = `https://www.dropbox.com/oauth2/authorize`;
	let redirect_uri = `${util.getProtocol(req)}://${req.get('host')}/dropbox/`;
	let client_id = obj.get(server, 'dropbox.client_id');
	if (!client_id) {
		res.send('dropbox client_id not found');
		res.end();
		return;
	}

	return `<script>window.location='${url}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${req.query.go}'</script>`;
}

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

	// load dropbox config
	let [config] = await db.find('config', {
		query: {
			company_id: ObjectID(res.locals.token.sub),
			type: 'dropbox',
		},
	});
	if (!config) {
		config = {
			type: 'dropbox',
			company_id: ObjectID(res.locals.token.sub),
		};
  }

  // save the token to the google config
  // retrieve access token from the authorization code
  let form = {
    code: req.query.code,
    grant_type: 'authorization_code',
		client_id: obj.get(server, 'dropbox.client_id'),
    client_secret: obj.get(server, 'dropbox.client_secret'),
    redirect_uri: `${util.getProtocol(req)}://${req.get('host')}/dropbox/`
  };
	let response = await rp({
		method: 'POST',
		uri: 'https://api.dropboxapi.com/oauth2/token',
		form,
	});
	response = JSON.parse(response)

  // write tokens on config
  await db.update('config', {
		...config,
		...response,
	});

	return `<script>window.location='${req.query.state}'</script>`;
}

