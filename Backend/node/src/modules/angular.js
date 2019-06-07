const path = require("path");
const fs = require("fs");
const ObjectID = require("mongodb").ObjectID;

module.exports.requiresAuthentication = async function requiresAuthentication(
  db,
  req,
  res
) {
  if (req.method == "GET") return false;
  return true;
};

module.exports.process = async function process(db, req, res) {
  // get the filename
  let paths = req.path.split("/");
  let filename = paths[paths.length - 1];

  // process index.js
  if (filename == "index.js") {
    return IndexJS(req, res);
  }
  // otherwise return index.html
  return IndexHtml(req, res);
};

module.exports.authenticated = async function authenticated(db, req, res) {
  // angular navigation
  let angular_navigation = await db.find(
    "angular.navigation",
    { navigation_id: `${res.locals.nav._id}` },
    { order: 1 },
    1000
  );

  // get all uiElementIds from angular_navigation
  let angular_ui = {};
  if (angular_navigation) {
    let uiElementIds = [];
    for (let nav of angular_navigation) {
      if (nav.uiElementIds)
        uiElementIds.push.apply(uiElementIds, nav.uiElementIds);
      if (nav.hidden && nav.hidden.uiElementIds)
        uiElementIds.push.apply(uiElementIds, nav.hidden.uiElementIds);
      if (nav.children) {
        for (let child of nav.children) {
          if (child.uiElementIds)
            uiElementIds.push.apply(uiElementIds, child.uiElementIds);
          if (child.hidden && child.hidden.uiElementIds)
            uiElementIds.push.apply(uiElementIds, child.hidden.uiElementIds);
        }
      }
    }
    // create an or filter
    let elementIdFilter = { $or: [] };
    for (let elementId of uiElementIds)
      elementIdFilter.$or.push({ _id: ObjectID(elementId) });

    // retrieve angular ui
    let angular_ui_list = await db.find(
      "angular.ui",
      elementIdFilter,
      null,
      1000
    );

    // convert to dictionary
    for (let ui of angular_ui_list) angular_ui[`${ui._id}`] = ui;
  }
  return JSON.stringify(
    {
      angular_navigation: angular_navigation,
      angular_ui: angular_ui
    },
    null,
    4
  );
};

// return app configuration js
async function IndexJS(req, res) {
  //
  let config = {
    rest: `${getProtocol(req)}://${req.get("host")}${req.baseUrl}`,
    auth: `${getProtocol(req)}://${req.get("host")}${req.baseUrl}${
      res.locals.nav.url
    }`
  };
  config = Object.assign(config, res.locals.nav);
  return `window.__CONFIG__ = ${JSON.stringify(config)}`;
}

async function IndexHtml(req, res) {
  return new Promise(function(resolve, reject) {
    // read "index.tmpl" from static folder
    let filepath = path.join(req.app.locals.wwwroot, "index.tmpl");
    fs.readFile(filepath, "utf8", function(err, contents) {
      if (err != null) reject(err);
      else {
        let result = contents
          .replace("@title", res.locals.nav.name)
          .replace("@base_href", `<base href='${res.locals.nav.url}'>`)
          .replace(
            "@path",
            res.locals.nav.url == "/" ? "" : res.locals.nav.url
          );

        resolve(result);
      }
    });
  });
}

function getProtocol(req) {
  var proto = req.connection.encrypted ? "https" : "http";
  // only do this if you trust the proxy
  proto = req.headers["x-forwarded-proto"] || proto;
  return proto.split(/\s*,\s*/)[0];
}
