const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
var jsonic = require('jsonic')

class MONGODB_DataSink {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    async init() {
        // connect to mongodb
        let that = this
        await new Promise(function (resolve, reject) {
            MongoClient.connect(that.property.connection, { useNewUrlParser: true }, function (err, client) {
                if (err) {
                    console.log(err)
                    process.exit()
                }

                that.client = client
                that.db = client.db(that.property.db)

                console.log(`MONGODB_DataSink::init ${that.property.db}`)
                resolve()
            })
        })

        // create a buffer
        this.buffer = []
        this.count = 0

        // listen to incoming events
        this.context.event.on(
            this.property.id
            , this.property.id
            , async (data , count) => { await this.incoming(data, count); }
        );
    }

    async incoming(data, count) {
        this.count++

        // calculate the condition
        let condition = eval(this.property.condition)
        if (this.property.transform) eval(this.property.transform)

        // update document
        try {

            let id = data._id
            // remove _id in the update set
            delete data._id

            let that = this
            await new Promise(function (resolve, reject) {
                that.db.collection(that.property.collection).updateOne(
                    condition
                    , { $set: data }
                    , { upsert: true }
                    , (err, res) => {
                        if (err) throw err
                        // restore id
                        data._id = id
                        resolve()
                    }
                )
            })

        } catch (err) {
            console.log(err)
            process.exit()
        }

    }

    start() {
        // do nothing
    }

    finish() {
        // db close
        this.client.close()

        // stop listening
        this.context.event.remove(this.property.id)

        //
        console.log(`MONGODB_DataSink::finish - ${this.count} sent`)
    }
}

module.exports = MONGODB_DataSink