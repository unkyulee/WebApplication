function doGet(e) {
	// route navigation
	return HtmlService.createHtmlOutputFromFile('src/index').setXFrameOptionsMode(
		HtmlService.XFrameOptionsMode.ALLOWALL
	);
}

function loadComponents() {
	let db = connectDB("DB");
	let data = sheetData(db, "component");

	return data;
}

function loadNavigation() {
	let db = connectDB("DB");
	let data = sheetData(db, "navigation");

	return data;
}