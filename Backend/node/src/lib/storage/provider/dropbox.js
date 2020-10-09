const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');
const fetch = require('isomorphic-fetch'); // or another library of choice.
const Dropbox = require('dropbox').Dropbox;
const MemoryStream = require('memorystream');

module.exports = {
	upload: async function (db, res, req, params) {
		// get dropbox access token
		let [config] = await db.find('config', {
			query: {
				company_id: ObjectID(obj.get(res, 'locals.token.sub', params.company_id)),
				type: 'dropbox',
			},
		});
		if (!config) {
			throw 'dropbox config does not exist';
		}

		// folder
		if (!obj.get(req, 'query.folder')) {
			throw 'no folder path specified';
		}
		let folder = obj.get(req, 'query.folder', '').trim();

		// get uploaded filestream
		let file = await this.fileContent(req);
		if (req.query.filename) file.filename = req.query.filename;

		// upload to dropbox
		let result = await this.uploadDropbox(config.access_token, `/${folder}/${file.filename}`, file.contents);
		return [result];
	},

	async fileContent(req) {
		return new Promise(function (resolve, reject) {
			let _filename;
			var memStream = new MemoryStream(null, { readable: false });
			req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
				// save filename
				_filename = filename;
				// write to the memory buffer
				file.pipe(memStream);
			});
			req.busboy.on('finish', function () {
				resolve({
					filename: _filename,
					contents: Buffer.concat(memStream.queue),
				});
			});
			req.pipe(req.busboy);
		});
	},

	async uploadDropbox(access_token, saveTo, contents) {
		return new Promise(function (resolve, reject) {
			var dbx = new Dropbox({ accessToken: access_token, fetch: fetch });
			dbx.filesUpload({
				path: saveTo,
				contents: contents,
				strict_conflict: false,
			})
				.then(function (response) {
					console.log(response)
					resolve(encodeURIComponent(saveTo));
				})
				.catch(function (err) {
					reject(JSON.stringify(err));
				});
		});
	},

	download: async function (db, res, req, params) {
		// get dropbox access token
		let company_id = params.company_id;
		if(!company_id) company_id = obj.get(res, 'locals.token.sub');

		let [config] = await db.find('config', {
			query: {
				company_id: ObjectID(company_id),
				type: 'dropbox',
			},
		});
		if (!config) {
			throw 'dropbox config does not exist';
		}

		// download
		const dbx = new Dropbox({ accessToken: config.access_token, fetch: fetch });
		let file = await dbx.filesDownload({ path: obj.get(params, 'filepath') });

		// put some header
		res.setHeader('Content-disposition', `inline; filename=${encodeURIComponent(file.name)}`);
		for (let header of obj.get(params, 'headers', [])) {
			res.setHeader(header.key, header.value);
		}
		res.end(file.result.fileBinary, 'binary');
	},
};
