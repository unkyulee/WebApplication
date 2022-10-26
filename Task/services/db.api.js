const axios = require("axios");

module.exports = {
  async get(api, option, process) {
    // retrieve data
    let url = `${api}?size=0`;
    let response = await axios.get(url, option);
    response = response.data;

    if (response.total > 0) {
      let rows = [];

      let size = 1000;
      let total_page = Math.ceil(response.total / size);
      for (let page = 0; page < total_page; page++) {
        url = `${api}?size=${size}&page=${page + 1}`;
        let parts = await axios.get(url, option);
        parts = parts.data;

        // post process
        if (process) for (let row of parts.data) await process(row);

        // append to rows
        rows = [...rows, ...parts.data];                     
      }

      return rows;
    }
  },
};
