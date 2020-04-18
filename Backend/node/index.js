const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const obj = require('object-path');

// retrieve secret
app.locals.secret = process.env.SECRET;

// initialize encryption
const Encryption = require('./src/lib/encryption');
app.locals.encryption = new Encryption(app.locals.secret);

// process cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Process the static files
app.locals.wwwroot = path.join(__dirname, 'wwwroot');
app.use(express.static(app.locals.wwwroot));

// process multiparts
var busboy = require('connect-busboy');
app.use(busboy());

// process forms
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// default TZ setup
if (process.env.TZ) {
	var moment = require('moment-timezone');
	moment.tz.setDefault(process.env.TZ);
}

// catch all
const router = require('./src/services/router');
const auth = require('./src/services/auth');
const MongoDB = require('./src/db/mongodb');

app.all('*', async (req, res) => {handler(req, res)});

async function handler(req, res) {
	let db = null;
	try {
		// connect to mongodb
		db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
		await db.connect();

		// check pre process
		if ((await router.preProcess(db, req, res)) == false) return;

		// process routing and get navigation
		res.locals.nav = await router.resolveNavigation(db, req, res);
		if (!res.locals.nav) {
			res.status(404);
			res.end();
			return;
		}

		res.locals.module = require(`./src/modules/${res.locals.nav.module}`);
		if (!res.locals.module) {
			res.status(404);
			res.end();
			return;
		}

		// authenticate
		if (await auth.canModuleProcess(db, req, res)) {
			// process the page
			res.send(await res.locals.module.process(db, req, res));
		} else {
			res.end();
		}
	} catch (e) {
		console.error(e);
		res.status(500);
	} finally {
		// Close MongoDB
		if (db) await db.close();
		res.end();
	}

	// send analytics
	if (process.env.TID) {
		let client_id = obj.get(res, 'locals.token.unique_name');
		if (!client_id) {
			let params = Object.assign({}, req.query, req.body);
			client_id = params.client_id;
		}

		await axios.post('http://www.google-analytics.com/collect', {
			v: 1,
			tid: process.env.TID,
			cid: client_id,
			t: 'pageview',
			dh: req.get('host'),
			dp: req.url,
		});
	}
}

// start the task
if (process.env.TASK) {
	let interval = parseInt(process.env.TASK);
	const task = require('./src/services/task');
	console.log(`start task with ${interval}s`);
	task.run(interval, process.env.DATABASE_URI, process.env.DB);
}

// Initiate the server
app.listen(process.env.PORT, () => {
	console.log(`PORT: ${process.env.PORT}, IP: ${process.env.BIND_IP}`);
	console.log(`DATABASE_URI: ${process.env.DATABASE_URI}, DB: ${process.env.DB}`);
});
