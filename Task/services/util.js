const fs = require("fs");

module.exports = {
  //
  fileExist(filePath) {
    return new Promise((resolve) => {
      fs.access(filePath, fs.F_OK, (err) => {
        if (err) {
          return resolve(false);
        }
        //file exists
        resolve(true);
      });
    });
  },
};
