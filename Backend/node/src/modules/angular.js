const path = require("path");
const fs = require("fs");
const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const util = require("../lib/utility");

module.exports = {
  // check if any request needs login process
  // during the loading of angualr app, doesn't require login
  // but when method is "POST" then it is authentication request
  async requiresAuthentication(db, req, res) {
    if (req.method == "GET") {
      res.clearCookie("company_id");
      res.clearCookie("authorization");

      return false;
    }
    return true;
  },

  async process(db, req, res) {
    // get the filename
    let paths = req.path.split("/");
    let filename = paths[paths.length - 1];

    // process index.js
    if (filename == "index.js") {
      return await IndexJS(db, req, res);
    } else if (filename == "index.json") {
      return await IndexJSON(db, req, res);
    }
    // process login screen
    else if (filename == "login.config") {
      return await LoginScreen(db, req, res);
    }
    // process navigation request
    else if (filename == "navigation.config") {
      return await Navigation(db, req, res);
    }
    // process ui element request
    else if (filename == "ui.element") {
      return await UIElement(db, req, res);
    }

    // otherwise return index.html
    return await IndexHtml(db, req, res);
  },
};
// module export ends
/////////////////////////////////////////////////////////

// return app configuration js
async function IndexJS(db, req, res) {
  //
  let config = {
    host: `${util.getProtocol(req)}://${req.get("host")}${req.baseUrl}`,
  };
  config = Object.assign(config, res.locals.nav);

  return `window.__CONFIG__ = ${JSON.stringify(config)}`;
}

// return app configuration js
async function IndexJSON(db, req, res) {
  //
  let config = {
    host: `${util.getProtocol(req)}://${req.get("host")}${req.baseUrl}`,
  };
  config = Object.assign(config, res.locals.nav);

  return config;
}

// retrieve login screen
async function LoginScreen(db, req, res) {
  // retrieve login screen
  let _id = obj.get(res.locals, "nav._id");
  if (_id) {
    let results = await db.find("core.ui", { query: { _id } });
    if (results && results.length > 0) return results[0];
  }
}

async function Navigation(db, req, res) {
  let _id = obj.get(res.locals, "nav._id");

  // retrieve theme
  let theme = {};
  if (_id) {
    let results = await db.find("core.theme", {
      query: { _id },
    });
    if (results && results.length > 0) theme = results[0];
  }

  // retrieve permission
  let permission = new Set();
  let groupIDs = obj
    .get(res.locals, "token.groups", [])
    .map((x) => ObjectID(x));
  let groups = await db.find("group", { query: { _id: { $in: groupIDs } } });
  for (let group of groups) {
    let permissions = obj.ensureExists(group, "permissions", []);
    for (let p of permissions) {
      permission.add(p);
    }
  }

  // retrieve features and load navigation
  let nav = [];
  let set = [];
  let features = obj.get(res.locals, "nav.features", []);

  // retrieve core.features all at once
  let core_features = await db.find("core.feature", {
    query: { key: { $in: features } },
    size: 10000,
  });

  if (core_features && core_features.length > 0) {
    for (let feature of features) {
      // find the feature from the db result
      let core_feature = core_features.find((x) => x.key == feature);
      if (core_feature) {
        // get navigation
        let navigations = obj.get(core_feature, "navigations");
        if (navigations) nav = [...nav, ...navigations];
        // get settings
        let settings = obj.get(core_feature, "settings");
        if (settings) set = [...set, ...settings];
      }
    }
  }

  // merge settings at the end
  if (set.length > 0) {
    nav.push({
      name: "Imp.",
      type: "collapse",
      permissions: ["config.view"],
      children: set,
    });
  }

  // retrieve module configuration all at once
  let core_configs = await db.find("config", {
    query: {
      company_id: obj.get(res.locals, "nav._id"),
      type: { $in: features },
    },
    size: 10000,
  });
  let module = {};

  if (core_configs) {
    for (let feature of features) {
      let core_config = core_configs.find((x) => x.type == feature);
      if (core_config) module[feature] = core_config;
    }
  }

  return { theme, permissions: Array.from(permission), nav, module };
}

async function UIElement(db, req, res) {
  let id = obj.get(req.query, "uiElementId");
  if (id) {
    let results = await db.find("core.ui", { query: { _id: ObjectID(id) } });
    if (results && results.length > 0) return results[0];
  }
}

async function IndexHtml(db, req, res) {
  return new Promise(function (resolve, reject) {
    // read "index.tmpl" from static folder
    let filepath = path.join(req.app.locals.wwwroot, "/angular.html");
    fs.readFile(filepath, "utf8", function (err, contents) {
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
