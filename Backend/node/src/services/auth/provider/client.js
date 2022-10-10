const ObjectID = require("mongodb").ObjectID;
const util = require("../../../lib/utility");
const jwt = require("jsonwebtoken");
const obj = require("object-path");

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
    let authenticated = false;

    // load login configuration
    // retrieve public config
    let [config] = await db.find("config", {
      query: {
        company_id: ObjectID(req.headers["company_id"]),
        type: "public",
      },
    });

    if (config) {
      // check if login is enabled
      if (obj.get(config, "login.enabled") && req.body.email) {
        // search in client database
        // find in the db - 'client'
        let results = await db.find("client", {
          query: {
            email: req.body.email,
            company_id: ObjectID(req.headers["company_id"]),
          },
        });

        if (results.length > 0) {
          let user = results[0];

          if (obj.get(config, "login.policy") == "email") {
            // login policy - check if email exists
            authenticated = true;
          } // login policy - email end
          // check if email & password
          else if (obj.get(config, "login.policy") == "password") {
            //
            // validate password
            if (!user.password && !req.body.password) {
              // when both user and request has empty password
              // then skip password validation
              authenticated = true;
            }
            if (user.password && req.body.password) {
              let hashedPassword = req.app.locals.encryption.hash(
                req.body.password
              );
              if (hashedPassword == user.password) {
                authenticated = true;
              }
            }
          } // login policy - password end

          // when authenticated, create token
          if (authenticated) {
            // create token
            let token = util.createToken({
              secret: req.app.locals.secret,
              issuer: req.get("host"),
              subject: req.headers["company_id"],
              audience: "client",
              expiresIn: "30d",
              id: user.email,
              name: user.name,
            });

            // set header
            res.set("Authorization", `Bearer ${token}`);

            // save token info to the global
            res.locals.token = jwt.verify(token, req.app.locals.secret);
          }
        }
      }
    }

    return authenticated;
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
        if (res.locals.token.aud == "client") {
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
              audience: "client",
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
        }
      } catch (e) {
        authenticated = false;
        console.error(e);
      }
    }

    return authenticated;
  },
};
