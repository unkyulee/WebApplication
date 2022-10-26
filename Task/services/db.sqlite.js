const sqlite3 = require("sqlite3");

module.exports = {
  init(path) {
    return new sqlite3.Database(path);
  },

  createTable(db, table, schema) {
    try {
      // form columns
      let columns = schema
        .map((x) => {
          return `${x.field} ${x.type}`;
        })
        .join();

      db.serialize(() => {
        // create table
        db.run(`CREATE TABLE ${table} (${columns})`);
      });
    } catch (ex) {
      console.error(ex);
    }
  },

  async get(db, table) {
    return new Promise(function (resolve, reject) {
      db.all(`SELECT * FROM ${table}`, function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  },

  async import(db, table, schema, rows) {
    try {
      // prepare columns
      let inserts = schema
        .filter((x) => x.skip_insert != true)
        .map((x) => `?`)
        .join();

      let columns = schema
        .filter((x) => x.skip_insert != true)
        .map((x) => x.field)
        .join();

      // insert rows
      let stmt;
      for (let row of rows) {
        stmt = db.prepare(
          `INSERT INTO ${table} (${columns}) VALUES (${inserts})`
        );

        // preapre an array according to the schema
        let params = [];
        for (let column of schema) {
          if (column.skip_insert) continue;
          if (row[column.field]) {
            // clean the text to be safe
            if (
              typeof row[column.field] === "string" ||
              row[column.field] instanceof String
            ) {
              row[column.field] = row[column.field].replace(/[]*/g, "");
            }
            params.push(row[column.field]);
          } else params.push("");
        }
        await stmt.run(params);
      }
      if (stmt) await stmt.finalize();
    } catch (ex) {
      console.error(ex);
    }
  },
};
