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
async function IndexJS(db, req, res) {
	//
	let config = {
		host: `${getProtocol(req)}://${req.get('host')}${req.baseUrl}`
	};

	// load company information
	config = Object.assign(config, res.locals.nav);

	// features
	let features = obj.get(res.locals.nav, 'features', []);
	for (let feature of features) {
		let results = await db.find('core.feature', { query: { key: feature } });
		if (results && results.length > 0) {
			config.uiElementId = obj.get(results, "0.uiElementId", '');
			break; // take only the first feature
		}
	}
	// return as a javascript
	return `window.__CONFIG__ = ${JSON.stringify(config)}`;
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
		// read "index.tmpl" from static folder
		let filepath = path.join(req.app.locals.wwwroot, '/vue.html');
		fs.readFile(filepath, 'utf8', function(err, contents) {
			if (err != null) reject(err);
			else {
				let result = contents
					.replace('@title', res.locals.nav.name)
					.replace('@base_href', `<base href='${res.locals.nav.url}'>`)
					.replace('@path', res.locals.nav.url == '/' ? '' : res.locals.nav.url);

				resolve(result);
			}
		});
	});
}

function getProtocol(req) {
	var proto = req.connection.encrypted ? 'https' : 'http';
	// only do this if you trust the proxy
	proto = req.headers['x-forwarded-proto'] || proto;
	return proto.split(/\s*,\s*/)[0];
}
