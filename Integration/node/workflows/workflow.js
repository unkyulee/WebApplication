const fs = require("fs");
var jsonic = require("jsonic");

class Workflow {
  constructor(context) {
    this.context = context;
    this.workflows = [];
  }

  async start(filepath) {
    try {
      await this.load(filepath);
      await this.runPackage();
    } catch (e) {
      console.error(e);
    }
  }

  async load(filepath) {
    // load from workpackage file
    var workflow = fs.readFileSync(filepath, "utf8");
    workflow = this.preProcess(workflow);

    this.context.workflow = jsonic(workflow);

    // print out info
    console.log(`-------------------------------------------------`);
    console.log(`package name: ${this.context.workflow.name}`);
    console.log(`   ${this.context.workflow.description}`);
    console.log(`-------------------------------------------------`);
  }

  async runPackage() {
    // load packages and run each of them
    for (let p of this.context.workflow.packages) {
      // print package information
      console.log(`--`);
      console.log(`-- ${p.name}`);
      console.log(`--`);

      // clear event listeners
      this.context.event.clear();

      // start listening to events
      this.context.event.on("workflow", "finish", async () => {
        // finish workflow
        for (let workflow of this.workflows) await workflow.finish();
      });

      // load current package workflow
      this.workflows = [];
      if (p.workflows) {
        for (let item of p.workflows) {
          let createdItem = this.itemFactory(item);
          if (createdItem) this.workflows.push(createdItem);
        }

        try {
          await this.init();
          await this.run();
        } catch (e) {
          console.error(e);
          process.exit();
        }
      }
    }
  }

  async init() {
    console.log("WorkPackage::init");

    // init workflow
    for (let workflow of this.workflows) await workflow.init();
  }

  async run() {
    console.log("WorkPackage::run");
    // start workflow
    for (let workflow of this.workflows) await workflow.start();
  }

  itemFactory(item) {
    let itemType = null;
    switch (item.type) {
      case "CSV_DataSource":
        itemType = require("./datasources/csv");
        break;
      case "MSSQL_DataSource":
        itemType = require("./datasources/mssql");
        break;
      case "FILES_DataSource":
        itemType = require("./datasources/files");
        break;
      case "SQLITE_DataSource":
        itemType = require("./datasources/sqlite");
        break;
      case "Channel_Transform":
        itemType = require("./transforms/channel");
        break;
      case "REST_DataSink":
        itemType = require("./datasinks/rest");
        break;
      case "MONGODB_DataSink":
        itemType = require("./datasinks/mongodb");
        break;
      case "SQLITE_DataSink":
        itemType = require("./datasinks/sqlite");
        break;
      case "REST_Action":
        itemType = require("./actions/rest");
        break;
      case "MONGODB_Action":
        itemType = require("./actions/mongodb");
        break;
    }

    if (itemType) return new itemType(this.context, item);
  }

  preProcess(content) {
    let startPos = 0;
    let endPos = 0;

    while (true) {
      startPos = content.indexOf(`"""`);
      if (startPos < 0) break;
      endPos = content.indexOf(`"""`, startPos + 3);
      if (endPos < 0) break;

      let part = content.substring(startPos, endPos+3);
      // convert multiline to single line
      let replaced = part.replace(new RegExp(`"""`, 'g'), "");
      replaced = JSON.stringify(replaced);
      content = content.replace(part, replaced);
    }

    return content;
  }
}

module.exports = Workflow;
