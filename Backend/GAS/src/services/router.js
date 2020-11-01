function route(e) {
	// retrieve url
	objectPath.ensureExists(e, '', {});
	let url = objectPath.get(e, 'parameter.v', '');

	// lookup in route table
	let routes = sheetData(e.DB, 'route', (x) => x.url == url);
	let route = objectPath.get(routes, '0', {});

	// look for configuration matches method
	let config = route.configuration;
	if (config) {
		config = JSON.parse(config);
		let configKey = `${e.method}_configuration`;
		let workflowKey = `${e.method}_workflow`;

		//
		if (config[configKey] && config[workflowKey]) {
			// pass to workflow
			let workflow = eval(config[workflowKey]);

			// execute workflow
			return workflow(e, config[configKey]);
		} else {
			//
			return ContentService.createTextOutput(
				JSON.stringify({
					error: `ROUTE CONFIG NOT EXIST: ${e.method} ${e.queryString}`,
				})
			).setMimeType(ContentService.MimeType.JSON);
		}
	} else {
		//
		return ContentService.createTextOutput(
			JSON.stringify({
				error: `ROUTE NOT EXIST: ${e.method} ${e.queryString}`,
			})
		).setMimeType(ContentService.MimeType.JSON);
	}
}
