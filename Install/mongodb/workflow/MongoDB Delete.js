async function run() {
	// read configuration
	let config = res.locals.configuration;
	if (!config) return 'No Configuration Specified';

	config = jsonic(config);
	let collection = config['collection'];
	if (!collection) return 'No Collection Specified';

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
	let rows = await ds.find(collection, { query: filter });
	if (rows.length > 0) {
		// make a copy in the 'deleted'
		await ds.insert('deleted', {
			_deleted: new Date(),
			_deletedBy: res.locals.token['unique_name'],
			collection,
			records: rows,
		});
		// then delete
		let result = await ds.delete(collection, filter);

		if (config.postProcess) {
			for (let process of config.postProcess) {
				try {
					await eval(process);
				} catch (ex) {
					console.error(ex);
				}
			}
		}

		return result;
	}
}

run();
