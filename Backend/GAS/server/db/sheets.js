/*
// Connect to customer DB
  let db = connectDB();
  let customerData = readSheet(db, 'customer');
 
  Logger.log(customerData);
  
  // return json success results
  return ContentService
    .createTextOutput(JSON.stringify({"result":"success", "data": customerData}))
    .setMimeType(ContentService.MimeType.JSON);
*/

function currentDir() {
  // locate the current script location
  var q = "fullText contains 'WcTkR9KDgVe8i951gP8o'";
  var files = DriveApp.searchFiles(q);
  if(files.hasNext()) {
    // Core located
    var core = files.next();
    // Locate the folder path
    var folder = core.getParents();
    if(folder.hasNext()) {
      return folder.next();
    } else {
      throw "CORE_DIR_NOT_FOUND";
    }
  } else {
    throw "CORE_NOT_FOUND";
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

function connectDB(name) {
  // locate current direction
  var folder = currentDir();
  
  // locate the sheets with the name      
  var db = DriveApp.searchFiles(`parents in '${folder.getId()}' and mimeType = '${MimeType.GOOGLE_SHEETS}' and title = '${name}'`);
  if(db.hasNext()) {
    db = db.next();
    // open sheets and return
    return SpreadsheetApp.open(db)
  }
  
  return false;
}


////////////////////////
function find(db, sheet_name, query) {   
  var rows = [];
  
  var sheet = db.getSheetByName(sheet_name);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var values = sheet.getDataRange().getValues();
  
  // convert to rows
  for(var i = 1; i < values.length; i++) {
    let row = {};
    for(let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
    }
    //
    rows.push(row);
  }    
  
  return rows;
}

function writeSheet(db, sheet_name, row) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var nextRow = sheet.getLastRow()+1; // get next row
  var row = []; 
  // loop through the header columns
  for (i in headers){
    if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
      row.push(new Date());
    } else { // else use header name to get data
      row.push(e.parameter[headers[i]]);
    }
  }
  // more efficient to set values as [][] array than individually
  sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
  
}