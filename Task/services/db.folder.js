const fs = require("fs");

module.exports = {
  async get(filepath, process, all) {
    // load files
    // passsing directoryPath and callback function
    let files = fs.readdirSync(filepath);
    let rows = [];
    for (let file of files) {
      let row = {
        filename: file,
      };
      if(process) {
        await process(row);
      }
      rows.push(row);
    }

    if(all) rows = await all(rows);
    return rows;
  },
};
