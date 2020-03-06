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

  // write tokens on config
  config.dropbox_api_key = req.app.locals.encryption.encrypt(req.query.code);
  await db.update('config', config);

  return `<script>window.location='${req.query.state}'</script>`;

};

module.exports.authenticated = async function authenticated(req, res) {
	return;
};
