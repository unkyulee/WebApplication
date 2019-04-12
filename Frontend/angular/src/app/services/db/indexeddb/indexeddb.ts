import Dexie from "dexie";

export class IndexedDBStrategy {
  constructor() {}

  // connection handler
  db;
  dbConfig;

  async connect(dbConfig) {
    // save configuration
    this.dbConfig = dbConfig;

    // connect to the db
    this.db = new Dexie(dbConfig.name);

    // create storage
    this.db.version(1).stores(dbConfig.definition);
    this.db.open().catch(async e => {
      console.error("Open failed: " + e.stack);
      // delete database
      await this.db.delete();
      // rerun the schema creation
      this.db.version(1).stores(dbConfig.definition);
    });
  }

  // insert records
  async insert(table, rows) {
    if (rows != null) {
      this.db
        .transaction("rw", this.db[table], async () => {
          for (let row of rows) {
            await this.db[table].put(row);
          }
        })
        .catch(e => {
          console.error(e);
        });
    }
  }

  async list(table, where, sort, limit, skip) {
    let whereClause = this.db[table];
    if (where && where.key) {
      whereClause = whereClause[where.key];
      // analyze the where clause
      for (let key of Object.keys(where)) {
        if (key == "key") continue;

        //
        let filter = {};
        filter[key] = where[key];
        whereClause = whereClause.and(filter);
      }
    } else {
      // if the key is not given then just return the list

    }

    return whereClause.toArray();
  }
}
