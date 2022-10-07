const path = require("path");
const fs = require("fs");
const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const util = require("../lib/utility");

module.exports.requiresAuthentication = async function requiresAuthentication(
  db,
  req,
  res
) {
  // if the request is POST and the path doesn't have filename
  let paths = req.url.split("?")[0].split("/");
  if (paths.length == 3 && req.method == "POST") {
    // root path POST is authentication request
    return true;
  }

  // otherwise it is open
  return false;
};

module.exports.process = async function process(db, req, res) {
  // get the filename
  let paths = req.url.split("?")[0].split("/");
  // cover for the root url
  if (!paths[2]) paths[2] = "";
  if (paths[2] == "index.js") {
    paths[2] = "";
    paths.push("index.js");
  }
  let filename = paths[paths.length - 1];

  // get company config
  // company name must be passed on the URL
  if (paths.length >= 2) {
    // load config of the module from company configuration of the module
    let [company] = await db.find("core.company", {
      query: { url: `/${paths[2]}` },
    });
    res.locals.company = company;

    // process index.js
    if (filename == "index.js") {
      return await IndexJS(db, req, res);
    }
    // process ui element request
    else if (filename == "ui.element") {
      return await UIElement(db, req, res);
    }
    // otherwise return index.html
    return IndexHtml(db, req, res);
  }
};

// return vue application
async function IndexHtml(db, req, res) {
  // read "index.tmpl" from static folder
  let filepath = path.join(req.app.locals.wwwroot, "/vue.html");
  let contents = fs.readFileSync(filepath, "utf8");

  let base_href = `${res.locals.nav.url}${res.locals.company.url}`;
  let result = contents
    .replace("@title", res.locals.company.name)
    .replace("@base_href", `<base href='${base_href}'>`)
    .replace("@path", base_href);

  return result;
}

// return app configuration js
// URL must be compose of /[feature]/[company]
async function IndexJS(db, req, res) {
  // retrieve public config
  let [theme] = await db.find("config", {
    query: { company_id: res.locals.company._id, type: "public" },
  });
  if (theme) {
    delete theme.company_id;
    delete theme._id;
  }

  // retrieve features and load navigation
  let nav = [];
  let module = {};
  let features = obj.get(res.locals.company, "public_features", []);
  for (let key of features) {
    let [feature] = await db.find("core.feature", { query: { key } });
    if (feature) {
      // check if the feature is enabled
      [feature_config] = await db.find("config", {
        query: { company_id: res.locals.company._id, type: key },
      });
      if (!feature_config) feature_config = {};
      if (feature_config && feature_config.enabled != false) {
        // get navigation
        let navigations = obj.get(feature, "public_navigations");
        if (navigations) nav = [...nav, ...navigations];
        // add module config
        module[key] = feature_config.public;
      }
    }
  }

  //
  let config = {
    host: `${util.getProtocol(req)}://${req.get("host")}${req.baseUrl}`,
    url: `${res.locals.nav.url}${res.locals.company.url}`,
    theme,
    nav,
    module,
  };

  // remove unnecessaries
  delete res.locals.company.module;
  delete res.locals.company._createdBy;
  delete res.locals.company._created;
  delete res.locals.company._updated;
  res.locals.company.features = res.locals.company.public_features;
  delete res.locals.company.public_features;

  // create index.js
  config = { ...res.locals.company, ...config };
  return `window.__CONFIG__ = ${JSON.stringify(config)}`;
}

async function UIElement(db, req, res) {
  let id = obj.get(req.query, "uiElementId");
  if (id) {
    let results = await db.find("core.ui", { query: { _id: ObjectID(id) } });
    if (results && results.length > 0) return results[0];
  }
}
