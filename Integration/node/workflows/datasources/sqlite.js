const sqlite = require('sqlite')

class SQLITE_DataSource {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    // initialized
    async init() {

        //
        if (!this.property.connection) {
            console.log('SQLITE_DataSource::init connection must be specified')
            process.exit()
        }

        // connect to the database        
        this.db = await sqlite.open(this.property.connection, { Promise });

    }

    async finish() {
        
    }

    async start() {

        // read data        
        let count = 0
        let query = eval(this.property.sql)
        
        let results = await this.db.all(query)
        for(let row of results) {
            count++            
            await this.context.event.emit(this.property.id, row, count)
        }

        // close connection
        this.db.close()

        // data stream read completed
        console.log(`SQLITE_DataSource::start - ${count} read`)
        await this.context.event.emit('finish')

    }

}

module.exports = SQLITE_DataSource