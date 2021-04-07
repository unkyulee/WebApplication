const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");

module.exports = {
  provider: async function (db, res, req, params = {}) {
    let company_id = params.company_id;
    if (!company_id) company_id = obj.get(res, "locals.token.sub");
    if (!company_id) {
      res.status(500);
      throw "storage provider failed: company_id does not exist";
    }

    // retrieve storage configuration
    params.config = await db.find("config", {
      query: {
        type: "storage",
        company_id: ObjectID(company_id),
      },
    });
    if (params.config && params.config.length > 0) {
      params.config = params.config[0];
    } else {
      throw "storage provider failed: storage config does not exist";
    }

    // send email depending on the provider
    switch (params.config.provider) {
      case "Dropbox":
        return require("./provider/dropbox");
      case "Google Drive":
        return require("./provider/google");
    }
  },

  upload: async function (db, res, req, params = {}) {
    let storageProvider = await this.provider(db, res, req, params);
    if (storageProvider) return storageProvider.upload(db, res, req, params);
  },

  download: async function (db, res, req, params = {}) {
    let storageProvider = await this.provider(db, res, req, params);
    if (storageProvider) return storageProvider.download(db, res, req, params);
  },
};
