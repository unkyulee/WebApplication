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

  async update(table, row) {
    if (row != null) {
      this.db
        .transaction("rw", this.db[table], async () => {
          await this.db[table].put(row);
        })
        .catch(e => {
          console.error(e);
        });
    }
  }

  async list(table, where, sort, limit, offset) {
    let Collection: any = []
    let Table = this.db[table];

    // see if there is a where condition
    if (where) {
      Collection = Table.where(where);
    } else {
      Collection = Table.toCollection();
    }

    // see if there is sort
    if (sort) {
      for (let key of Object.keys(sort)) {
        if (sort[key] == false) {
          Collection = Table.orderBy(key).reverse();
        } else {
          Collection = Table.orderBy(key)
        }
      }
    }

    // apply limit and offset
    if(limit > 0) Collection = Collection.limit(limit)
    if(offset >= 0) Collection = Collection.offset(offset)

    return Collection.toArray();
  }

  async delete(table, where) {
    let Table = this.db[table];

    // see if there is a where condition
    if (where) {
      return Table.where(where).delete();
    } else {
      // delete all
      return this.db[table].clear();
    }
  }
}
