const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

class MongoDB {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName || "web";
    this.client = null;
  }

  async connect() {
    let that = this;
    return new Promise(function(resolve, reject) {
      MongoClient.connect(
        that.url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function(err, client) {
          if (err == null && client != null) {
            that.client = client;
            that.db = client.db(that.dbName);
            resolve(that.db);
          } else {
            reject(err);
          }
        }
      );
    });
  }

  async close() {
    if (this.client) {
      this.client.close();
    }
  }

  async count(collection, query) {
    let that = this;
    return new Promise(function(resolve, reject) {
      if (!that.db) reject("db not initialized");
      that.db
        .collection(collection)
        .find(query)
        .count((err, count) => {
          if (err) reject(err);
          resolve(count);
        });
    });
  }

  async find(collection, query) {
    let that = this;

    return new Promise(function(resolve, reject) {
      if (!that.db) reject("db not initialized");
      let q = that.db.collection(collection);
      if (query.query) q = q.find(query.query);
      if (query.aggregate) q = q.aggregate(query.aggregate);
      if (query.project) q = q.project(query.project);
      if (query.sort) q = q.sort(query.sort);
      if (query.limit) q = q.limit(query.limit);
      if (query.skip) q = q.skip(query.skip);

      q.toArray(function(err, results) {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  async update(collection, data) {
    let that = this;
    return new Promise(function(resolve, reject) {
      if (!that.db) reject("db not initialized");

      // check if it has _id - UPDATE
      if (data._id) {
        let id = data._id;
        // remove _id in the update set
        delete data._id;
        // update document
        that.db
          .collection(collection)
          .updateOne({ _id: ObjectID(`${id}`) }, { $set: data }, (err, res) => {
            if (err) reject(err);
            // restore id
            data._id = id;
            resolve(id);
          });
      }

      // INSERT
      else {
        // insert the document
        that.db.collection(collection).insertOne(data, (err, res) => {
          if (err) reject(err);
          resolve(data._id);
        });
      }
    });
  }

  async insert(collection, data) {
    let that = this;
    return new Promise(function(resolve, reject) {
      if (!that.db) reject("db not initialized");

      // INSERT
      if (data._id) data._id = ObjectID(`${data._id}`);
      that.db.collection(collection).insertOne(data, (err, res) => {
        if (err) reject(err);
        resolve(data._id);
      });
    });
  }

  async delete(collection, query) {
    let that = this;
    return new Promise(function(resolve, reject) {
      if (!that.db) reject("db not initialized");
      if (!query) reject("delete filter not specified");
      that.db.collection(collection).deleteMany(query, (err, obj) => {
        if (err) reject(err);
        resolve(obj.result.n > 0);
      });
    });
  }
}

module.exports = MongoDB;
