const sql = require('mssql')

class MSSQL_DataSource {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    // initialized
    async init() {

        // connect to
        try {
            await sql.connect(this.property.connection)
            console.log(`connected to ${this.property.connection}`)
        } catch (err) {
            // ... error checks
            console.log(err)
            process.exit()
        }

    }

    async finish() {
        sql.close()
    }

    async start() {

        // read data
        let query = eval(this.property.sql)
        const result = await sql.query(query)
        let count = 0
        for(let row of result.recordset) {
            await this.context.event.emit(this.property.id, row, ++count)
        }

        // data stream read completed
        console.log(`MSSQL_DataSource::start - ${result.recordset.length} read`)
        await this.context.event.emit('finish')
    }

}

module.exports = MSSQL_DataSource