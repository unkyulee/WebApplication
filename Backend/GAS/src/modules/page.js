function pageProcess(e) {
  if(!e) e = {}
	var pageName = e.queryString;
	if (!pageName) pageName = 'index';

	// load page content from the DB
  let page = sheetData('page', (x) => { return x.url == pageName });
	if (page && page.length > 0) {
		// return html
		return HtmlService.createHtmlOutput(page[0].content);
  }

  // Page not found
  return HtmlService.createHtmlOutput(`Page not found`);
}
