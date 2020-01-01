const path = require("path");
const fs = require("fs");
const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");

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
    return await IndexJS(db, req, res);
  }
  // process login screen
  else if (filename == "login.config") {
    return await LoginScreen(db, req, res);
  }
  // process navigation request
  else if (filename == "navigation.config") {
    return await Navigation(db, req, res);
  }
  // otherwise return index.html
  return IndexHtml(db, req, res);
};

// return app configuration js
async function IndexJS(db, req, res) {
  //
  let config = {
    host: `${getProtocol(req)}://${req.get("host")}${req.baseUrl}`
  };
  config = Object.assign(config, res.locals.nav);
  return `window.__CONFIG__ = ${JSON.stringify(config)}`;
}

// retrieve login screen
async function LoginScreen(db, req, res) {
  // retrieve login screen
  let _id = obj.get(res.locals, "nav.login");
  if (_id) {
    let results = await db.find("core.ui", { _id: ObjectID(_id) });
    if (results && results.length > 0) return results[0];
  }
}

async function Navigation(db, req, res) {
  // retrieve theme
  let _id = obj.get(res.locals, "nav.theme");
  let theme = {};
  if (_id) {
    let results = await db.find("core.theme", { _id: ObjectID(_id) });
    if (results && results.length > 0) theme = results[0];
  }

  return {theme}
}

async function IndexHtml(db, req, res) {
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
