// global context
context = {};

async function run() {
	// initialize
	await initialize();

	// retrieve previous data
	await getPrevData();

	let error = await verifyData();
	if (error) {
		return error;
	}

	// set default field
	defaultFields();

	// encrypt fields
	if (context.config.encryptedFields) {
		for (let field of context.config.encryptedFields) {
			if (context.data[field]) {
				context.data[field] = req.app.locals.encryption.encrypt(context.data[field]);
			}
		}
	}

	// exclude fields
	if (context.config.excludeFields) {
		for (let field of context.config.excludeFields) delete context.data[field];
	}

	// upsert
	if (context.prev) {
		context._id = await context.ds.update(context.config.collection, context.data);
	} else {
		context._id = await context.ds.insert(context.config.collection, context.data);
	}

	// monitor
	await monitorChanges();

	// return result
	return { _id: context._id };
}

///
async function initialize() {
	// get configuration
	context.config = res.locals.configuration;
	if (!context.config) {
		throw new Error('No Configuration Specified');
	}

	// convert to json object
	context.config = jsonic(context.config);
	if (!obj.get(context, 'config.collection')) {
		throw new Error('No Collection Specified');
	}

	// retrieve questring and form values
	context.data = Object.assign({}, req.query, req.body);

	// retrieve data service
	context.ds = res.locals.ds;
	if (!context.ds) {
		throw new Error('No data service initialized');
	}

	// connect to database
	await context.ds.connect();
}

////
async function getPrevData() {
	// retrieve current data
	let rows = await context.ds.find(context.config.collection, {
		query: {
			_id: ObjectID(context.data._id),
		},
	});
	if (rows.length > 0) {
		context.prev = rows[0];
	}
}

// verify data
async function verifyData() {
	if (context.config.verify) {
		for (let verifyConfig of context.config.verify) {
			let valid = await verify(verifyConfig);
			if (!valid) {
				return { error: verifyConfig.message };
			}
		}
	}
}

async function verify(verifyConfig) {
	let result = false;
	switch (verifyConfig.type) {
		case 'MatchIfExists':
			{
				if (context.prev == null) {
					// verify only when data exists
					result = true;
					break;
				}
				let source = context.prev[verifyConfig.column];
				if (!source) {
					// verify only when data exists
					result = true;
				}

				// is any algorithm applied?
				switch (verifyConfig.algorithm) {
					case 'encryption':
						{
							let target = context.data[verifyConfig.field];
							if (target) {
								source = req.app.locals.encryption.decrypt(source);
								result = source == target;
							} else {
								result = true;
							}
						}
						break;

					case 'hash':
						{
							let target = context.data[verifyConfig.field];
							if (target) {
								target = req.app.locals.encryption.hash(target);
								result = source == target;
							} else {
								// if value doesn't exist?
								result = true;
							}
						}
						break;
				}
			}
			break;
	}

	return result;
}

function defaultFields() {
	// remove _params_ if exists
	obj.del(context.data, '_params_');

	//
	let fields = obj.get(context, 'config.defaultFields', []);
	for (let def of fields) {
		switch (def.type) {
			case 'Date':
				{
					let value = obj.get(context.data, def.column);
					if (value) context.data[def.column] = new Date(value);
				}
				break;
			case 'DateInArray':
				{
					let array = obj.get(context.data, def.path);
					if (array) {
						for (let v of array) {
							if (v[def.column]) {
								v[def.column] = new Date(v[def.column]);
							}
						}
					}
				}
				break;
			case 'NowIfNew':
				if ((!context.prev || !context.prev[def.column]) && !context.data[def.column]) {
					context.data[def.column] = new Date();
				} else if (context.data[def.column]) {
					context.data[def.column] = new Date(context.data[def.column]);
				}
				break;
			case 'Now':
				context.data[def.column] = new Date();
				break;
			case 'header':
				{
					let value = req.headers[def.key];
					if (!value) throw new Error(`No ${def.key} specified`);
					if (def.column == 'company_id') value = ObjectID(value);
					context.data[def.column] = value;
				}
				break;
			case 'hash':
				if (context.data[def.column])
					context.data[def.column] = req.app.locals.encryption.hash(context.data[def.column]);
				break;
			case 'tokenIfNew':
				if (res.locals.token[def.key] && (!context.prev || (context.prev && !context.prev[def.column]))) {
					context.data[def.column] = res.locals.token[def.key];
				}
				break;
			case 'Unique':
				{
					// do not create duplicate of the value
					if (context.data[def.column]) {
						// initialize context.prev
						if (!context.prev) context.prev = {};
						if (!context.prev[def.column]) context.prev[def.column] = [];

						// check if the value exists
						for (let value of context.data[def.column]) {
							let item = context.prev[def.column].find(x => x[def.key] == value[def.key]);
							if (!item) {
								context.prev[def.column].push(value);
							}
						}

						// convert to array
						context.data[def.column] = context.prev[def.column];
					}
				}
				break;
			case 'ObjectID':
				if (context.data[def.column]) {
					if (Array.isArray(context.data[def.column])) {
						context.data[def.column] = context.data[def.column].map(x => ObjectID(x));
					} else context.data[def.column] = ObjectID(context.data[def.column]);
				}
				break;
		}
	}
}

async function monitorChanges() {
	if (context.prev) {
		let monitors = obj.get(context.config, 'monitors', []);
		for (let monitor of monitors) {
			let prev = obj.get(context.prev, monitor);
			let curr = obj.get(context.data, monitor);

			if (prev && curr && JSON.stringify(prev) != JSON.stringify(curr)) {
				// create change log
				let changelog = {
					source: context.config.collection,
					reference: context._id,
					_createdBy: res.locals.token['unique_name'],
					_created: new Date(),
					company_id: ObjectID(req.headers['company_id']),
					column: monitor,
					prev,
					curr,
				};
				await context.ds.insert('changelog', changelog);
			}
		}
	}
}

//
run();
