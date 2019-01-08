const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

class MongoDB {
  constructor(url, dbName) {
    this.url = url
    this.dbName = dbName || 'web'
  }

  async connect() {
    let that = this

    return new Promise(function (resolve, reject) {
      if (that.db)
        resolve(that.db)
      else {
        MongoClient.connect(that.url, { useNewUrlParser: true }, function (err, client) {
          if (err == null && client != null) {
            that.client = client
            that.db = client.db(that.dbName)
            resolve(that.db)
          }
          else {
            reject(err)
          }
        })

      }
    })

  }

  async count(collection, query) {
    let that = this
    return new Promise(function (resolve, reject) {
      if (!that.db) reject('db not initialized')
      that.db.collection(collection)
        .find(query)
        .count((err, count) => {
          if (err) reject(err)
          resolve(count)
        })
    })
  }

  async find(collection, query, sort = null, limit = 10, skip = 0, project = {}) {
    let that = this
    if (!sort) sort = { _created: -1 }

    return new Promise(function (resolve, reject) {
      if (!that.db) reject('db not initialized')
      that.db.collection(collection)
        .find(query)
        .project(project)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .toArray(function (err, results) {
          if (err) reject(err)
          resolve(results)
        })
    })

  }


  async aggregate(collection, query, group, sort) {
    let that = this
    if (!sort) sort = { _created: -1 }

    return new Promise(function (resolve, reject) {
      if (!that.db) reject('db not initialized')
      that.db.collection(collection)
        .aggregate([
          {$match: query}
          , {$group: group}
        ])
        .toArray((err, results) => {
          if (err) reject(err)
          resolve(results)
        })
    })
  }

  async update(collection, data) {
    let that = this
    return new Promise(function (resolve, reject) {
      if (!that.db) reject('db not initialized')

      // check if it has _id - UPDATE
      if (data._id) {
        let id = data._id
        // remove _id in the update set
        delete data._id
        // update document
        that.db.collection(collection)
          .updateOne(
            { _id: ObjectID(`${id}`) }
            , { $set: data }
            , (err, res) => {
              if (err) reject(err)
              // restore id
              data._id = id
              resolve(id)
            }
          )
      }

      // INSERT
      else {
        // insert the document
        that.db.collection(collection)
          .insertOne(
            data
            , (err, res) => {
              if (err) reject(err)
              resolve(data._id)
            }
          )
      }

    })
  }



  async delete(collection, query) {
    let that = this
    return new Promise(function (resolve, reject) {
      if (!that.db) reject('db not initialized')
      if (!query) reject('delete filter not specified')
      that.db.collection(collection)
        .deleteMany(query, (err, obj) => {
          if (err) reject(err)
          resolve(obj.result.n > 0)
        });
    })
  }



}

module.exports = MongoDB