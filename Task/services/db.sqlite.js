const sqlite3 = require("sqlite3");

module.exports = {
  createTable(path, table, schema) {
    let db;
    try {
      // open db
      db = new sqlite3.Database(path);

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
    } finally {
      if (db) {
        // close db
        db.close();
      }
    }
  },

  import(path, table, schema, rows) {
    let db;
    try {
      // open db
      db = new sqlite3.Database(path);

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
      db.serialize(() => {
        const stmt = db.prepare(
          `INSERT INTO ${table} (${columns}) VALUES (${inserts})`
        );
        for (let row of rows) {
          // preapre an array according to the schema
          let params = [];
          for (let column of schema) {
            if (column.skip_insert) continue;
            if (row[column.field]) params.push(row[column.field]);
            else params.push("");
          }          
          stmt.run(params);          
        }
        stmt.finalize();
      });
    } catch (ex) {
      console.error(ex);
    } finally {
      if (db) {
        // close db
        db.close();
      }
    }
  },
};
