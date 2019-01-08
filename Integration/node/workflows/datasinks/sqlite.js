const Database = require('better-sqlite3')
const strMatch = require('../../lib/strMatch')

class SQLITE_DataSink {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    init() {
        // connect to the database        
        this.db = new Database(this.property.connectionString);

        this.count = 0

        // run init script
        for (let init of this.property.init) {
            this.db.exec(init);
        }

        // prepare insert statement
        let columns = this.property.mappings.map(x => x.target).join(', ')
        let values = this.property.mappings.map(x => `@${x.target}`).join(', ')
        this.insert = this.db.prepare(`INSERT INTO ${this.property.table} (${columns}) VALUES (${values})`);
        this.insertMany = this.db.transaction((rows) => {
            for (const row of rows) this.insert.run(row);
        });

        // create a buffer
        this.buffer = []

        // listen to incoming events
        this.handler = (count, data) => { this.incoming(count, data) }
        this.context.event.on(
            this.property.id
            , this.handler
        );
    }

    incoming(count, data) {

        // mapping
        let result = {}
        for (let mapping of this.property.mappings) {
            let source = mapping['source']
            let target = mapping['target']

            if (mapping['type'] == 'search') {
                // find a key that matches
                let key = Object.keys(data).find(x => strMatch(x, mapping['source']))
                if (key) result[target] = data[key]
            }
            else {
                result[target] = data[source]
            }
        }

        // insert
        this.count += 1
        this.buffer.push(result)

        // insert when buffer reached its size
        if( ! this.property.buffer ) {
            this.insert(result)
            this.buffer = []
        }
            
        else if(this.buffer.length >= this.property.buffer) {
            this.insertMany(this.buffer)
            this.buffer = []
        }
    }

    start() {
        // do nothing
    }

    finish() {

        // flush the buffer if any exists
        if(this.buffer.length > 0) {
            this.insertMany(this.buffer)
            this.buffer = []
        }

        // stop listening
        this.context.event.removeListener(this.property.id, this.handler)

        // close connection
        this.db.close()

        // 
        console.log(`SQLITE_DataSink::finish - ${this.count} written`)
    }
}

module.exports = SQLITE_DataSink