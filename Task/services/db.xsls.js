const XLSX = require("xlsx");

module.exports = {
  async get(filepath, process, all) {
    // load excel
    let workbook = XLSX.readFile(filepath);
    let sheet_name_list = workbook.SheetNames;
    let rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    for (let row of rows) {
      // post process
      if (process) await process(row);
    }

    // process on all rows
    if (all) rows = await all(rows);
    
    return rows;
  },
};
