var rp = require('request-promise-native');
const ObjectID = require('mongodb').ObjectID;

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
  if(config && config.length > 0) {
    config = config[0]
  } else {
    res.status(404);
		res.end();
		return;
  }

  // request for token
  let response = {}
  try {
    response = await rp({
      method: 'POST',
      uri: 'https://oauth2.googleapis.com/token',
      form: {
        code: req.query.code,
        client_id: config.google_client_id,
        client_secret: config.google_client_secret,
        grant_type: 'authorization_code',
        redirect_uri: `${req.protocol}://${req.headers.host}/google/`
      },
    });
  } catch(e) {
    res.send(`${e.stack}`);
    res.status(500);
    res.end();
    return;
  }

  // write tokens on config
  config.google = JSON.parse(response);
  await db.update('config', config);

  return `<script>window.location='${req.query.state}'</script>`;

};

module.exports.authenticated = async function authenticated(req, res) {
	return;
};
