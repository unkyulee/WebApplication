const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
const obj = require('object-path');

class Auth {
	async canModuleProcess(db, req, res) {
		// check if the request is authenticated
		let isAuthenticated = await this.isAuthenticated(db, req, res);

		// check if the current module requires authentication
		let requiresAuthentication = await res.locals.module.requiresAuthentication(db, req, res);
		// if authentication is not required then proceed
		if (requiresAuthentication == false) {
			return true;
		}
		if (isAuthenticated == false) {
			// if not authenticated then try to authenticate the request
			isAuthenticated = await this.authenticate(db, req, res);
			if (isAuthenticated == false) {
				// clear cookie
				res.clearCookie('company_id');
				res.clearCookie('authorization');
        res.set('Authorization', ``);

				// authentication failed
				res.status(403);
			}
		}

		// authenticated
		return isAuthenticated;
	}

	// authenticate the user
	async authenticate(db, req, res) {
		let authenticated = false;

		// get id, password, company_id
		if (req.body.id && req.headers['company_id']) {
			// find in the db - 'user'
			let results = await db.find('user', {
				query: {
					id: req.body.id,
					company_id: ObjectID(req.headers['company_id']),
				},
			});
			if (results.length > 0) {
				let user = results[0];

				// validate password
				if (!user.password && !req.body.password) {
					// when both user and request has empty password
					// then skip password validation
					authenticated = true;
				}
				if (user.password && req.body.password) {
					let hashedPassword = req.app.locals.encryption.hash(req.body.password);
					if (hashedPassword == user.password) {
						authenticated = true;
					}
				}
				if (authenticated) {
					// create token
					this.createToken(req, res, user.id, user.name, user.groups);
				}
			}
		}

		return authenticated;
	}

	// create JWT token
	createToken(req, res, id, name, groups) {
		var signOptions = {
			issuer: req.get('host'),
			subject: req.headers['company_id'],
			audience: req.get('host'),
			expiresIn: '30d',
		};
		var payload = {
			unique_name: id,
			nameid: name,
			groups,
		};
		// create token
		let token = jwt.sign(payload, req.app.locals.secret, signOptions);

		// set header
		res.set('Authorization', `Bearer ${token}`);

		// save token info to the global
		res.locals.token = jwt.verify(token, req.app.locals.secret);
	}

	async isAuthenticated(db, req, res) {
		let authenticated = false;

		// do the JWT toekn thingy
		let token;
		if (req.headers.authorization) token = req.headers.authorization.replace('Bearer ', '');
		// if headers not given check cooikes - only if it is get and file download
		else if (req.cookies.authorization && req.method == 'GET') {
			token = req.cookies.authorization.replace('Bearer ', '');
		} else if (req.query.bearer && req.method == 'GET') {
			token = req.query.bearer;
		}

		if (token) {
			res.locals.bearer = token;

			try {
				// decoded token will be saved as token in the res.locals
				res.locals.token = jwt.verify(token, req.app.locals.secret);

				if (obj.get(res.locals.token, 'groups')) {
					// if authentication is expiring soon then issue a new token
					// if half of the time is passed then renew
					let tokenSpan = res.locals.token.exp - res.locals.token.iat;
					let currSpan = res.locals.token.exp - new Date() / 1000;
					if (tokenSpan / 2 > currSpan) {
						// create token
						this.createToken(
							req,
							res,
							res.locals.token.unique_name,
							res.locals.token.nameid,
							res.locals.token.groups
						);
					}

					// authenticated
					authenticated = true;
				}
			} catch (e) {
				authenticated = false;
			}
		}

		return authenticated;
	}
}

module.exports = new Auth();
