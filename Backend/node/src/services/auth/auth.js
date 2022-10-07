const obj = require("object-path");

module.exports = {
  async provider(db, req, res) {
    // res.locals.nav.module
    // check module name to decide which auth policy to apply
    // only vue will have client authenication policy
    // rest shall have user authentication policy
    if (obj.get(res.locals, "nav.module")) {
      switch (res.locals.nav.module) {
        case "vue":
          return require("./provider/client");
        default:
          return require("./provider/user");
      }
    } else {
      // module name not specified
      throw new Error("module name not specified. Failed to load auth policy");
    }
  },

  async canModuleProcess(db, req, res) {
    let provider = await this.provider(db, req, res);
    if (provider) return provider.canModuleProcess(db, req, res);
  },
  async authenticate(db, req, res) {
    let provider = await this.provider(db, req, res);
    if (provider) return provider.authenticate(db, req, res);
  },
  async isAuthenticated(db, req, res) {
    let provider = await this.provider(db, req, res);
    if (provider) return provider.isAuthenticated(db, req, res);
  },
};
