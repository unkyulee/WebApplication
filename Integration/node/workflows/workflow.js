const fs = require('fs');
var jsonic = require('jsonic')

class Workflow {
    constructor(context) {
        this.context = context
        this.workflows = []
    }

    async start(filepath) {
        try {
            await this.load(filepath)
            await this.runPackage()
        } catch (e) {
            console.error(e)
        }
    }

    async load(filepath) {
        // load from workpackage file
        var workflow = fs.readFileSync(filepath, 'utf8');
        this.context.workflow = jsonic(workflow)

        // print out info
        console.log(`-------------------------------------------------`)
        console.log(`package name: ${this.context.workflow.name}`)
        console.log(`   ${this.context.workflow.description}`)
        console.log(`-------------------------------------------------`)
    }

    async runPackage() {

        // load packages and run each of them
        for (let p of this.context.workflow.packages) {

            // print package information
            console.log(`--`)
            console.log(`-- ${p.name}`)
            console.log(`--`)

            // clear event listeners
            this.context.event.clear()

            // start listening to events
            this.context.event.on('workflow', 'finish', async () => {
                // finish workflow
                for (let workflow of this.workflows)
                    await workflow.finish()
            });

            // load current package workflow
            this.workflows = []
            if (p.workflows) {
                for (let item of p.workflows) {
                    let createdItem = this.itemFactory(item)
                    if (createdItem)
                        this.workflows.push(createdItem)
                }

                try {
                    await this.init()
                    await this.run()
                } catch (e) {
                    console.error(e)
                    process.exit()
                }
            }

        }
    }

    async init() {
        console.log('WorkPackage::init')

        // init workflow
        for (let workflow of this.workflows)
            await workflow.init()
    }

    async run() {
        console.log('WorkPackage::run')
        // start workflow
        for (let workflow of this.workflows)
            await workflow.start()
    }

    itemFactory(item) {
        let itemType = null;
        switch (item.type) {
            case "CSV_DataSource":
                itemType = require('./datasources/csv')
                break;
            case "MSSQL_DataSource":
                itemType = require('./datasources/mssql')
                break;
            case "Channel_Transform":
                itemType = require('./transforms/channel')
                break;
            case "REST_DataSink":
                itemType = require('./datasinks/rest')
                break;
            case "MONGODB_DataSink":
                itemType = require('./datasinks/mongodb')
                break
            case "SQLITE_DataSink":
                itemType = null; // require('./datasinks/sqlite')
                break;
            case "REST_Action":
                itemType = require('./actions/rest')
                break;
            case "MONGODB_Action":
                itemType = require('./actions/mongodb')
                break;

        }

        if (itemType)
            return new itemType(this.context, item)
    }



}

module.exports = Workflow