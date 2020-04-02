const path = require('path');
const fs = require('fs');
const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');

module.exports.requiresAuthentication = async function requiresAuthentication(db, req, res) {
	if (req.method == 'GET') return false;
	return true;
};

module.exports.process = async function process(db, req, res) {
	// get the filename
	let paths = req.path.split('/');
	let filename = paths[paths.length - 1];

	// process index.js
	if (filename == 'index.js') {
		return await IndexJS(db, req, res);
	}
	// process ui element request
	else if (filename == 'ui.element') {
		return await UIElement(db, req, res);
	}
	// otherwise return index.html
	return IndexHtml(db, req, res);
};

// return app configuration js
// URL must be compose of /[feature]/[company]
async function IndexJS(db, req, res) {
	//
	let config = {
		host: `${getProtocol(req)}://${req.get('host')}${req.baseUrl}`,
	};

	// load feature configuration
	// there must be only 1 feature of the public views
	let features = obj.get(res.locals.nav, 'features', []);
	for (let feature of features) {
		let results = await db.find('core.feature', { query: { key: feature } });
		if (results && results.length > 0) {
			config.uiElementId = obj.get(results, '0.uiElementId', '');
			config.key = obj.get(results, '0.key', '');
			config.url = res.locals.nav.url;
			break; // take only the first feature
		}
	}

	let paths = req.url.split('/');
	// company name must be passed on the URL
	if (paths.length >= 2) {
		// load config of the module from company configuration of the module
		let company = await db.find('core.company', { query: { url: `/${paths[2]}` } });
		if (company && company.length > 0) {
			company = company[0]; // take the first row;
			// save company_id in the config
			config._id = company._id;
			config.name = company.name;
			config.locale = company.locale;
			// load the configuration of the module
			let configuration = await db.find('config', { query: { company_id: company._id, type: config.key } });
			if (configuration && configuration.length > 0) {
				config.feature = configuration[0];
			}
		}

		// check if the app is enabled
		if (config.feature.enabled) {
			// features
			// return as a javascript
			return `window.__CONFIG__ = ${JSON.stringify(config)}`;
		}
	}
}

async function UIElement(db, req, res) {
	let id = obj.get(req.query, 'uiElementId');
	if (id) {
		let results = await db.find('core.ui', { query: { _id: ObjectID(id) } });
		if (results && results.length > 0) return results[0];
	}
}

async function IndexHtml(db, req, res) {
	return new Promise(function(resolve, reject) {
		// base_href must contain company name
		let paths = req.url.split('?')[0].split('/');
		if (paths.length >= 2) {
			// read "index.tmpl" from static folder
			let filepath = path.join(req.app.locals.wwwroot, '/vue.html');
			fs.readFile(filepath, 'utf8', function(err, contents) {
				if (err != null) reject(err);
				else {
					let base_href = `${res.locals.nav.url == '/' ? '' : res.locals.nav.url}/${paths[2]}`;
					let result = contents
						.replace('@title', res.locals.nav.name)
						.replace('@base_href', `<base href='${base_href}'>`)
						.replace('@path', base_href);

					resolve(result);
				}
			});
		} else {
			reject();
		}
	});
}

function getProtocol(req) {
	var proto = req.connection.encrypted ? 'https' : 'http';
	// only do this if you trust the proxy
	proto = req.headers['x-forwarded-proto'] || proto;
	return proto.split(/\s*,\s*/)[0];
}
