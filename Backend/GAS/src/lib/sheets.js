////////////////////////////////////////////////
// CONNECT
////////////////////////////////////////////////
function connectDB(name) {
	// locate current direction
	var folder = currentDir();

	// locate the sheets with the name
	var db = DriveApp.searchFiles(
		`parents in '${folder.getId()}' and mimeType = '${MimeType.GOOGLE_SHEETS}' and title = '${name}'`
	);
	if (db.hasNext()) {
		db = db.next();
		// open sheets and return
		return SpreadsheetApp.open(db);
	}

	return false;
}

function currentDir() {
	// locate the current script location
	var q = "fullText contains 'WcTkR9KDgVe8i951gP8o'";
	var files = DriveApp.searchFiles(q);
	if (files.hasNext()) {
		// Core located
		var core = files.next();
		// Locate the folder path
		var folder = core.getParents();
		if (folder.hasNext()) {
			return folder.next();
		} else {
			throw 'CORE_DIR_NOT_FOUND';
		}
	} else {
		throw 'CORE_NOT_FOUND';
	}
}

function createDB(name) {
	// locate current direction
	var folder = currentDir();
	// create sheets
	var sheet = SpreadsheetApp.create(name);
	// move to the current dir
	var file = DriveApp.getFileById(sheet.getId());
	file.moveTo(DriveApp.getFolderById(folder.getId()));

	return sheet;
}

////////////////////////////////////////////////
// READ
////////////////////////////////////////////////
function sheetData(db, sheet_name, filter) {
	var sheet = db.getSheetByName(sheet_name);
	var data = sheet.getDataRange().getValues();

	var headers = data[0];
	var rows = [];

	// convert to rows
	for (var i = 1; i < data.length; i++) {
		let row = {};
		for (let j = 0; j < headers.length; j++) {
			row[headers[j]] = data[i][j];
		}
		//
		if (filter && !filter(row)) {
			continue;
		}

		//
		rows.push(row);
	}

	return rows;
}


////////////////////////////////////////////////
// WRITE
////////////////////////////////////////////////
function sheetInsert(sheet_name, data) {
	// load sheet from the name
	var db = connectDB('DB');
	var sheet = db.getSheetByName(sheet_name);

	// first row as column names
	var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

	// get the last row to insert the row
	var nextRow = sheet.getLastRow() + 1;

	//
	var row = [];
	// loop through the header columns
	for (i in headers) {
		if (headers[i] == 'id') {
			row.push(new Date().getTime());
		} else {
			row.push(data[headers[i]]);
		}
	}

	sheet.appendRow(row);
}
