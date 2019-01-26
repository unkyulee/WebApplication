const sqlite = require('sqlite')
var jsonic = require('jsonic')

class SQLITE_DataSink {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    async init() {
        //
        if (!this.property.connection) {
            console.log('SQLITE_DataSink::init connection must be specified')
            process.exit()
        }

        // connect to the database        
        this.db = await sqlite.open(this.property.connection, { Promise });

        this.count = 0

        // run init script      
        if (this.property.init) {
            for (let init_script of this.property.init) {
                await this.db.run(init_script);
            }
        }

        // listen to incoming events
        this.context.event.on(
            this.property.id
            , this.property.id
            , async (data, count) => { await this.incoming(data, count); }
        );

    }

    async incoming(count, data) {

        // transform
        if(this.property.transform) {            
            eval(this.property.transform)
        }

        // produce sql
        if(!this.property.sql) {
            console.log('SQLITE_DataSink::incoming sql must be specified')
            process.exit()
        }
        let sql = eval(this.property.sql)

        if(!this.property.values) {
            console.log('SQLITE_DataSink::incoming values must be specified')
            process.exit()
        }        
        let values = eval(this.property.values)        

        // run sql
        try {
            await this.db.run(sql, ...values);
        } catch(e) {
            console.log(sql)
            console.log(e)
            process.exit()
        }
        

    }

    start() {
        // do nothing
    }

    finish() {

        // stop listening
        this.context.event.remove(this.property.id)

        // close connection
        this.db.close()

        // 
        console.log(`SQLITE_DataSink::finish - ${this.count} written`)
    }
}

module.exports = SQLITE_DataSink