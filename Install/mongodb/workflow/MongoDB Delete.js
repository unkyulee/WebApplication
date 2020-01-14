async function run() {
	// read configuration
	let config = res.locals.configuration;
	if (!config) return 'No Configuration Specified';

	config = jsonic(config);
	let collection = config['collection'];
	if (!collection) return 'No Collection Specified';

	// check if it is admin mode
	let adminMode = false;
	if (config.admin == true) adminMode = true;

	let navigation_id = req.headers['company_id'];
	if (!navigation_id) return 'No company_id specified';

	// form values
	let data = Object.assign({}, req.query, req.body);

	// retrieve data service
	let ds = res.locals.ds;
	if (!ds) return 'No data service instantiated';

	// connect to database
	await ds.connect();

	// send delete query
	let filter = { $and: [{ _id: ObjectID(`${data._id}`) }] };

	// retrieve the data
  let rows = await ds.find(collection, {query:filter});
	if (rows.length > 0) {
		// make a copy in the 'deleted'
		await ds.insert('deleted', {
			_deleted: new Date(),
			_deletedBy: res.locals.token['unique_name'],
			collection,
			records: rows,
		});
		// then delete
		return await ds.delete(collection, filter);
	}
}

run();
