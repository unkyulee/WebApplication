const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
var jsonic = require('jsonic')

class MONGODB_Action {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    async init() {
    }

    async finish() {
    }

    async start() {
        // connect to mongodb
        let that = this
        await new Promise(function (resolve, reject) {
            MongoClient.connect(that.property.connection, { useNewUrlParser: true }, function (err, client) {
                if (err) {
                    console.log("MONGODB_Action::" + err)
                    console.log(err)
                    process.exit()
                }

                that.client = client
                that.db = client.db(that.property.db)

                console.log(`MONGODB_Action::init ${that.property.db}`)
                resolve()
            })
        })

        // do something
        if (this.property.action_type == 'delete') {
            let condition = eval(this.property.condition)

            console.log(`MONGODB_Action::start ${this.property.action_type} - ${JSON.stringify(condition)}`)

            let that = this
            let result = await new Promise(function (resolve, reject) {
                that.db.collection(that.property.collection).deleteMany(
                    condition
                    , (err, obj) => {
                        if (err) reject(err)
                        resolve(obj.result.n)
                    });
            })

            console.log(`MONGODB_Action::start affected ${result} rows`)
        }

        // db close
        this.client.close()

    }
}

module.exports = MONGODB_Action