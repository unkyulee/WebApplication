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
			type: 'dropbox',
		},
  });
  if(config && config.length > 0) {
    config = config[0]
  } else {
    res.status(404);
		res.end();
		return;
  }

  // retrieve access token from the authorization code
  let form = {
    code: req.query.code,
    grant_type: 'authorization_code',
		client_id: config.dropbox_app_key,
    client_secret: config.dropbox_app_secret,
    redirect_uri: `${util.getProtocol(req)}://${req.get('host')}/dropbox/`
	};
	response = await rp({
		method: 'POST',
		uri: 'https://api.dropboxapi.com/oauth2/token',
		form,
  });
  response = JSON.parse(response)

  // write tokens on config
  config.dropbox_api_key = req.app.locals.encryption.encrypt(response.access_token);
  await db.update('config', config);

  return `<script>window.location='${req.query.state}'</script>`;

};

module.exports.authenticated = async function authenticated(req, res) {
	return;
};
