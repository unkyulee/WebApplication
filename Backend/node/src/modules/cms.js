const path = require("path");
const fs = require("fs");
const ObjectID = require("mongodb").ObjectID;

module.exports.requiresAuthentication = async function requiresAuthentication(
  db,
  req,
  res
) {
  return false;
};

module.exports.process = async function process(db, req, res) {
  // resolve path
  let paths = req.path.split("/");
  if (res.locals.nav.url == "/")
    // if it is root url then add additional paths
    paths.unshift("");

  // get the filename
  let name = paths[paths.length - 1];

  // get folder
  let folder = `/${paths.slice(2, paths.length - 1).join("/")}`;

  // search for contents in cms
  let results = await db.find("cms", {
    query: {
      name: name,
      folder: folder
    }
  });
  if (results.length > 0) {
    return processContent(req, res, results[0]);
  }

  // not found
  res.status(404);
  res.end();
  return;
};

async function processContent(req, res, content) {
  if (content.headers) {
    for (let header of content.headers) {
      res.set(header.key, header.value);
    }
  }

  if (content.type == "base64") {
    content.content = Buffer.from(content.content, "base64");
  } else if(content.type == "binary") {
    content.content = content.content.buffer;
  }

  return content.content;
}

module.exports.authenticated = async function authenticated(req, res) {
  return;
};
