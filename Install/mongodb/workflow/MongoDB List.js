// a global context
let context = {};

//
async function run() {
	// initialize
	await initialize();

	// pre process
	await preProcess();

	// build filter before processing parameters
	processFilterFields();

	// setup special parameters
	// page, size, sort
	pagination();

	// build filter
	processFilter();

	// query
	await query();

	// exclude fields
	excludeFields();

	// post process
	await postProcess();

	// return result
	return {
		page: context.page,
		size: context.result.length,
		total: context.total,
		filter: JSON.parse(JSON.stringify(context.filter)),
		sort: JSON.parse(JSON.stringify(context.sort)),
		project: context.project,
		params: context.data,
		websvc: res.locals.websvcurl,
		data: context.result,
	};
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

///
function pagination() {
	// which page? starts with 1
	context.page = obj.get(context, 'data.page', 1);
	context.page = parseInt(context.page);

	// page size
	context.size = obj.get(context, 'data.size', 10);
	context.size = parseInt(context.size);

	// sort
	if (obj.get(context, 'data._sort')) {
		obj.ensureExists(context, 'sort', {});
		context.sort[context.data._sort] = 1;
	}

	// descending sort
	if (obj.get(context, 'data._sort_desc')) {
		obj.ensureExists(context, 'sort', {});
		context.sort[context.data._sort_desc] = -1;
	}

	// default sort by _created desc
	if (!context.sort) {
		obj.ensureExists(context, 'sort', {});
		context.sort['_created'] = -1;
	}

	// remove special parameters from the context.data
	obj.del(context.data, 'page');
	obj.del(context.data, 'size');
	obj.del(context.data, '_sort');
	obj.del(context.data, '_sort_desc');
}

function processFilterFields() {
	context.filter = { $and: [] };

	// _id should be converted to ObjectID
	if (obj.get(context.data, '_id')) {
		context.data._id = ObjectID(context.data._id);
	}

	// see if _search parameter exists
	if (obj.get(context.data, '_search')) {
		// add fulltext filter
		context.filter.$and.push({
			$text: { $search: context.data['_search'] },
		});

		// add textScore sort
		obj.ensureExists(context, 'sort', {});
		obj.set(context, 'sort.score.$meta', 'textScore');

		// add projection
		obj.ensureExists(context, 'config.aggregate', []);
		context.config.aggregate.push({ $addFields: { score: { $meta: 'textScore' } } });

		// remove _search from the data
		obj.del(context.data, '_search');
	}

	// see if _project parameter exists
	if (obj.get(context.data, '_project')) {
		let projects = obj
			.get(context.data, '_project', '')
			.trim()
			.split(',');
		if (projects) {
			context.project = {};
			for (let project of projects) context.project[project] = true;
		}
		// remove _search from the data
		obj.del(context.data, '_project');
	} else if (obj.get(context.data, '_project_ne')) {
		let projects = obj
			.get(context.data, '_project_ne', '')
			.trim()
			.split(',');
		if (projects) {
			context.project = {};
			for (let project of projects) context.project[project] = false;
		}
		// remove _search from the data
		obj.del(context.data, '_project_ne');
	}

	// check if the configuration has filterFields
	let filterFields = obj.get(context, 'config.filterFields', []);
	for (let field of filterFields) {
		switch (field.type) {
			case 'header':
				{
					// get header information and add to the filter
					let value = obj.get(req.headers, field.key);
					if (!value) {
						throw new Error(`No ${field.key} specified in the header`);
					}

					// form a field
					let f = {};
					if (field.key == 'company_id') value = ObjectID(value);
					f[field.column] = value;

					// add filter
					context.filter['$and'].push(f);
				}
				break;
			case 'filter':
				{
					// add filter
					context.filter['$and'].push(eval(field.filter));
				}
				break;
			case 'token':
				{
					if (res.locals.token[field.key]) {
						// add filter
						let f = {};
						f[field.column] = res.locals.token[field.key];
						context.filter['$and'].push(f);
					}
				}
				break;
			case 'ObjectID':
				{
					// convert to ObjectID in the provided data
					if (obj.get(context.data, field.column)) {
						obj.set(context.data, field.column, ObjectID(context.data[field.column]));
					}
				}
				break;
		}
	}
}

//
function processFilter() {
	for (let key of Object.keys(context.data)) {
		// range
		if (key.endsWith('_date_gte') || key.endsWith('_created_gte')) {
			let f = {};
			f[key.replace('_gte', '')] = { $gte: moment(context.data[key]).toDate() };
			context.filter.$and.push(f);
		} else if (key.endsWith('_date_gt') || key.endsWith('_created_gt')) {
			let f = {};
			f[key.replace('_gt', '')] = { $gt: moment(context.data[key]).toDate() };
			context.filter.$and.push(f);
		} else if (key.endsWith('_date_lte') || key.endsWith('_created_lte')) {
			let f = {};
			f[key.replace('_lte', '')] = { $lte: moment(context.data[key]).toDate() };
			context.filter.$and.push(f);
		} else if (key.endsWith('_date_lt') || key.endsWith('_created_lt')) {
			let f = {};
			f[key.replace('_lt', '')] = { $lt: moment(context.data[key]).toDate() };
			context.filter.$and.push(f);
		}
		// expression
		else if (key.endsWith('$')) {
			let f = {};
			f[key.substring(0, key.length - 1)] = eval(context.data[key]);
			context.filter.$and.push(f);
		}
		// otherwise, string filter
		else {
			// if it is array make an or filter
			if (Array.isArray(context.data[key])) {
				let or = { $or: [] };
				for (let v of context.data[key]) {
					let f = {};
					f[key] = v;
					or.$or.push(f);
				}
				context.filter.$and.push(or);
			} else if (context.data[key]) {
				let f = {};
				if (typeof context.data[key] == 'string') {
					f[key] = new RegExp(util.escapeRegExp(context.data[key]), 'ig');
				} else {
					f[key] = context.data[key];
				}
				context.filter.$and.push(f);
			}
		}
	}

	//
	// if $and is empty then remove
	if (context.filter.$and.length == 0) delete context.filter.$and;
}

///
async function preProcess() {
	let processes = obj.get(context, 'config.preProcess', []);
	for (let process of processes) {
		try {
			await eval(process);
		} catch (ex) {
			res.send(ex)
			throw ex
		}
	}
}

///
async function postProcess() {
	let processes = obj.get(context, 'config.postProcess', []);
	for (let process of processes) {
		try {
			await eval(process);
		} catch (ex) {
			res.send(ex)
			throw ex
		}
	}
}

///
async function query() {
	// query to the collection
	context.result = await context.ds.find(context.config.collection, {
		query: context.filter,
		aggregate: context.config.aggregate,
		sort: context.sort,
		size: context.size,
		skip: (context.page - 1) * context.size,
		project: context.project,
	});
	// get total records
	context.total = await context.ds.count(context.config.collection, context.filter);
}

function excludeFields() {
	let fields = obj.get(context, 'config.excludeFields', []);
	for (let field of fields) {
		for (let row of context.result) {
			if (row[field]) delete row[field];
		}
	}
}

//
run();
