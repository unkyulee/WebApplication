const path = require("path");
const fs = require("fs");
const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const util = require("../lib/utility");

module.exports = {
  // check if any request needs login process
  // during the loading of vue app, doesn't require login
  // but when method is "POST" then it is authentication request
  async requiresAuthentication(db, req, res) {
    if (req.method == "GET") return false;
    return true;
  },

  async process(db, req, res) {
    // get the filename
    let paths = req.url.split("?")[0].split("/");
    let filename = paths[paths.length - 1];

    // process ui element request
    if (filename == "ui.element") {
      return await UIElement(db, req, res);
    }

    // load config of the module from company configuration of the module
    if (await Init(db, req, res)) {
      // otherwise return index.html
      return IndexHtml(db, req, res);
    } else {
      res.status(404);
    }
  },
};
// module export ends
/////////////////////////////////////////////////////////

// init
async function Init(db, req, res) {
  // URL must be compose of /[site]/[company]/[profile_id]
  let paths = req.url.split("?")[0].split("/");
  // if last path is empty then remove it
  if (!paths[paths.length - 1]) paths.pop();

  // get app profile
  if (paths.length > 2) {
    let [app_profile] = await db.find("app_profile", {
      query: {
        id: paths[2],
      },
    });
    // check if existing company_id
    if (!app_profile) {
      console.error(`app_profile not found: ${paths[3]}`);
      return false;
    }
    // save app_profile to global
    res.locals.app_profile = app_profile;

    // load company_id
    let [company] = await db.find("core.company", {
      query: { _id: app_profile.company_id },
    });
    // check if existing company_id
    if (!company) {
      console.error(`company_id not found: ${app_profile.company_id}`);
      return false;
    }
    // save company_id to global
    res.locals.company = company;
  }

  return true;
}

// return vue application
async function IndexHtml(db, req, res) {
  // read "index.tmpl" from static folder
  let filepath = path.join(req.app.locals.wwwroot, "/vue.html");
  let contents = fs.readFileSync(filepath, "utf8");

  // retrieve app_profile
  let app_profile = { ...res.locals.app_profile };
  if (app_profile) {
    delete app_profile.company_id;
    delete app_profile._id;
    delete app_profile.default;
    delete app_profile._created;
    delete app_profile._updated;
    delete app_profile.private;
  }

  //
  let config = {
    ...app_profile,
    host: `${util.getProtocol(req)}://${req.get("host")}${req.baseUrl}`,
    url: `${res.locals.nav.url}${res.locals.company.url}`,
    _id: res.locals.company._id,
  };

  // load initial uiElementIds
  if (obj.get(app_profile, "features", []).length > 0) {
    let [feature] = await db.find("core.feature", {
      query: {
        key: obj.get(app_profile, "features.0"),
      },
    });
    config.uiElementIds = [feature.app];
  }

  let result = contents
    .replace("@title", app_profile.name)
    .replace("@script", `window.__CONFIG__ = ${JSON.stringify(config)}`);

  return result;
}

async function UIElement(db, req, res) {
  let id = obj.get(req.query, "uiElementId");
  if (id) {
    let results = await db.find("core.ui", { query: { _id: ObjectID(id) } });
    if (results && results.length > 0) return results[0];
    else {
      res.status(404);
    }
  }
}
