const objectPath = require("object-path");

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

class MongoDB {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName || "web";
    this.client = null;
  }

  async connect() {
    this.client = await MongoClient.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.client.db(this.dbName);
  }

  async close() {
    if (this.client) {
      this.client.close();
    }
  }

  async count(collection, query) {
    if (!this.db) {
      console.error("mongodb::count::db not initialized", collection, query);
      console.log(new Error().stack);
      return;
    }
    return await this.db.collection(collection).find(query).count();
  }

  async find(collection, query) {
    if (!this.db) {
      console.error("mongodb::find::db not initialized", collection, query);
      console.log(new Error().stack);
      return;
    }

    if(!query) query = {};
    if (!query.size) query.size = 10;
    if (!query.query) query.query = {};

    try {
      let q = this.db.collection(collection);

      // create query
      if (query.query && !query.aggregate) q = q.find(query.query);
      if (query.aggregate) {
        if (query.query) query.aggregate.unshift({ $match: query.query });
        q = q.aggregate(query.aggregate);
      }
      if (query.project) q = q.project(query.project);
      if (query.sort) q = q.sort(query.sort);
      if (query.size) q = q.limit(query.size);
      if (query.skip) q = q.skip(query.skip);

      // convert to array
      return await q.toArray();
    } catch (ex) {
      console.error("query failed", ex, collection, query);
      throw ex;
    }
  }

  async update(collection, data) {
    if (!this.db) {
      console.error("mongodb::update::db not initialized", collection, data);
      console.log(new Error().stack);
      return;
    }

    // check if it has _id - UPDATE
    if (data._id) {
      let id = data._id;
      // remove _id in the update set
      delete data._id;
      // update document
      try {
        await this.db
          .collection(collection)
          .updateOne({ _id: ObjectID(`${id}`) }, { $set: data });
      } catch (ex) {
        console.error(ex);
        console.error(collection, id, data);
        console.error(new Error().stack);
        throw ex;
      }
      // restore _id
      data._id = ObjectID(`${id}`);

      //
      return id;
    }

    // INSERT
    else {
      try {
        // insert the document
        await this.db.collection(collection).insertOne(data);
        return data._id;
      } catch (ex) {
        console.error(ex);
        console.error(collection, data);
        console.error(new Error().stack);
        throw ex;
      }
    }
  }

  async updateMany(collection, filter, data) {
    if (!this.db) {
      console.error("mongodb::updateAll::db not initialized", collection, data);
      console.log(new Error().stack);
      return;
    }
    // update document
    if (Object.keys(filter).length > 0) {
      await this.db.collection(collection).updateMany(filter, { $set: data });
    }
  }

  async insert(collection, data) {
    if (!this.db) {
      console.error("mongodb::insert::db not initialized", collection, data);
      console.log(new Error().stack);
      return;
    }

    // INSERT
    if (data._id) data._id = ObjectID(`${data._id}`);
    try {
      await this.db.collection(collection).insertOne(data);
    } catch (ex) {
      console.error(data);
      throw ex;
    }

    return data._id;
  }

  async delete(collection, query) {
    if (!this.db) {
      console.error("mongodb::delete::db not initialized", collection, query);
      console.log(new Error().stack);
      return;
    }
    if (!query) {
      console.error(
        "mongodb::delete::delete filter not specified",
        collection,
        query
      );
      console.log(new Error().stack);
      return;
    }
    await this.db.collection(collection).deleteMany(query);
  }
}

module.exports = MongoDB;
