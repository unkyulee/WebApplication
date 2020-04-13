const path = require('path');
const fs = require('fs');
const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');
const util = require('../lib/utility');

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

async function IndexHtml(db, req, res) {
	return new Promise(function (resolve, reject) {
		// base_href must contain company name
		let paths = req.url.split('?')[0].split('/');
		if (paths.length >= 2) {
			// read "index.tmpl" from static folder
			let filepath = path.join(req.app.locals.wwwroot, '/vue.html');
			fs.readFile(filepath, 'utf8', function (err, contents) {
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

// return app configuration js
// URL must be compose of /[feature]/[company]
async function IndexJS(db, req, res) {
	let paths = req.url.split('?')[0].split('/');
	// company name must be passed on the URL
	if (paths.length >= 2) {
		// load config of the module from company configuration of the module
		let [company] = await db.find('core.company', { query: { url: `/${paths[2]}` } });
		if (company) {
			// load feature configuration
			let featureKey = obj.get(res.locals.nav, 'features.0', []);
			if (featureKey) {
				// load feature configuration to get nav
				let [feature] = await db.find('core.feature', { query: { key: featureKey } });
				if (feature) {
					// load the configuration of the module
					let [configuration] = await db.find('config', {
						query: { company_id: company._id, type: featureKey },
					});
					if (configuration) {
						// check if the app is enabled
						if (configuration.enabled) {
							let config = {
								...obj.get(feature, 'public', {}),
								config: obj.get(configuration, 'public', {}),
								_id: company._id,
								name: company.name,
								host: `${util.getProtocol(req)}://${req.get('host')}${req.baseUrl}`,
								url: `${util.getProtocol(req)}://${req.get('host')}${req.baseUrl}${res.locals.nav.url}${
									company.url
								}`,
							};
							return `window.__CONFIG__ = ${JSON.stringify(config)}`;
						}
					}
				}
			}
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
