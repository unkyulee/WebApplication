const util = require("../../../lib/utility");
const jwt = require("jsonwebtoken");

module.exports = {
  async canModuleProcess(db, req, res) {
    let verified = false;

    // check if the current module requires authentication
    let requiresAuthentication = await res.locals.module.requiresAuthentication(
      db,
      req,
      res
    );
    // if authentication is not required then proceed
    if (requiresAuthentication == false) {
      verified = true;
    } else {
      // requires authentication

      // check authenticated
      let isAuthenticated = await this.isAuthenticated(db, req, res);
      if (isAuthenticated) {
        verified = true;
      } else {
        // try to authenticate
        isAuthenticated = await this.authenticate(db, req, res);
        if (isAuthenticated == false) {
          // authentication failed
          res.status(403);
          verified = false;
        }
      }
    }

    // authenticated
    return verified;
  },

  // authenticate the user
  async authenticate(db, req, res) {
    return false;
  },

  async isAuthenticated(db, req, res) {
    let authenticated = false;

    // retrieve the token from the header
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    //
    if (token) {
      try {
        // decoded token will be saved as token in the res.locals
        res.locals.token = jwt.verify(token, req.app.locals.secret);
        // authenticated
        authenticated = true;

        // if authentication is expiring soon then issue a new token
        // if half of the time is passed then renew
        let tokenSpan = res.locals.token.exp - res.locals.token.iat;
        let currSpan = res.locals.token.exp - new Date() / 1000;
        if (tokenSpan / 2 > currSpan) {
          // create token
          let token = util.createToken({
            secret: req.app.locals.secret,
            issuer: req.get("host"),
            subject: req.headers["company_id"],
            audience: req.get("host"),
            expiresIn: "30d",
            id: res.locals.token.unique_name,
            name: res.locals.token.nameid,
            groups: res.locals.token.groups,
          });

          // set header
          res.set("Authorization", `Bearer ${token}`);

          // save token info to the global
          res.locals.token = jwt.verify(token, req.app.locals.secret);
        }
      } catch (e) {
        authenticated = false;
        console.error(e);
      }
    }

    return authenticated;
  },
};
