// load configuration
function globalConfig(e) {
	// load page content from the DB
	let company = sheetData(e.DB, 'company');
	if (company && company.length > 0) {
		// add host
		company[0].host = `${ScriptApp.getService().getUrl()}?v=`;
		company[0].url = ``;

		// convert features into array
		company[0].features = company[0].features.split(',').map((x) => x.trim());
		//
		let config = `window.__CONFIG__ = ${JSON.stringify(company[0])};`;
		// return html
		return ContentService.createTextOutput(config).setMimeType(ContentService.MimeType.JAVASCRIPT);
	}

	// config not found
	return ContentService.createTextOutput(
		JSON.stringify({
			error: 'global config not found',
		})
	);
}

function navigationConfig(e, config) {
	return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(ContentService.MimeType.JSON);
}
