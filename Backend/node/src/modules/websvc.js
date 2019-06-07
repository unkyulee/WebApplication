const ObjectID = require("mongodb").ObjectID;
const hash = require("../lib/hash"); // used by user script
const jsonic = require("jsonic"); // used by user script
const path = require("path"); // userd by user script

module.exports.requiresAuthentication = async function requiresAuthentication(
  req,
  res
) {
  return true;
};

module.exports.process = async function process(db, req, res) {
  let result = {};

  // get websvc name
  let websvcurl = req.url.replace(res.locals.nav.url, "");
  if (websvcurl.startsWith("/")) websvcurl = websvcurl.replace("/", "");
  if (websvcurl.includes("?"))
    websvcurl = websvcurl.substring(0, websvcurl.indexOf("?"));
  res.locals.websvcurl = websvcurl;

  let method = req.method.toLowerCase();

  // get web service
  let websvcs = await db.find("core.websvc", {
    $and: [{ navigation_id: `${res.locals.nav._id}` }, { api_url: websvcurl }]
  });
  if (websvcs.length > 0) {
    let websvc = websvcs[0];

    // load configuration
    res.locals.configuration = websvc[`${method}_configuration`];

    // load dataservices
    if (websvc[`${method}_datasource`]) {
      let dataservices = await db.find("core.dataservice", {
        _id: ObjectID(websvc[`${method}_datasource`])
      });
      if (dataservices.length > 0) {
        let ds = dataservices[0];
        const MongoDB = require("../db/mongodb");
        res.locals.ds = new MongoDB(ds.connectionString, ds.database);
      }
    }

    // load workflow
    let workflow_id = websvc[`${method}_workflow`];

    if (workflow_id) {
      let workflows = await db.find("core.workflow", {
        _id: ObjectID(workflow_id)
      });
      if (workflows.length > 0) {
        let workflow = workflows[0];
        // run script
        result = await eval(workflow.script);
      }
    }

    // release the DB connection used locally
    if (res.locals.ds) res.locals.ds.close();
  }

  return result;
};
