const excel = require('node-excel-export');

(async function () {
	// form values
	let params = Object.assign({}, req.query, req.body);

	// load config
	await res.locals.ds.connect();

	let config;
	if (params.template) {
		// load from template
		config = await res.locals.ds.find('core.ui', {
			query: {
				_id: ObjectID(params.template),
			},
		});
		config = config[0];
	} else {
		// load from custom config
		config = await res.locals.ds.find('config', {
			query: {
				company_id: ObjectID(req.cookies['company_id']),
				type: 'excel',
				pdf: params.excel,
			},
		});
		config = config[0];
	}

	if (!config) {
		res.status(500);
		res.send(`configuration does not exist for ${req.cookies['company_id']} of pdf ${params.pdf}`);
		return;
	}

	// transform
	let options = await eval(config.data);

	// prepare excel
	const report = excel.buildExport(options);

	// send file
	res.setHeader('Content-disposition', `inline; filename=${new Date().getTime()}.xlsx`);
	res.end(report, 'binary');
})();
