const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");

module.exports = {
  provider: async function (db, res, req, params = {}) {
    let company_id = params.company_id;
    if (!company_id) company_id = obj.get(res, "locals.token.sub");
    if (!company_id) {
      res.status(500);
      throw "payment provider failed: company_id does not exist";
    }

    // retrieve storage configuration
    params.config = await db.find("config", {
      query: {
        type: "payment",
        company_id: ObjectID(company_id),
      },
    });
    if (params.config && params.config.length > 0) {
      params.config = params.config[0];
    } else {
      throw "payment provider failed: config does not exist";
    }

    // send email depending on the provider
    switch (params.config.provider) {
      case "stripe":
        return require("./provider/stripe");      
    }
  },

  setup: async function (db, res, req, params = {}) {
    let provider = await this.provider(db, res, req, params);
    if (provider) return provider.setup(db, res, req, params);
  },

  confirm: async function (db, res, req, params = {}) {
    let provider = await this.provider(db, res, req, params);
    if (provider) return provider.confirm(db, res, req, params);
  },
};
