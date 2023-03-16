const ObjectID = require("mongodb").ObjectID;
const util = require("../../../lib/utility");
const jwt = require("jsonwebtoken");
const obj = require("object-path");

module.exports = {
  async canModuleProcess(db, req, res) {
    // check if the request is authenticated
    let isAuthenticated = await this.isAuthenticated(db, req, res);

    // check if the current module requires authentication
    let requiresAuthentication = await res.locals.module.requiresAuthentication(
      db,
      req,
      res
    );
    // if authentication is not required then proceed
    if (requiresAuthentication == false) {
      return true;
    }
    if (isAuthenticated == false) {
      // if not authenticated then try to authenticate the request
      isAuthenticated = await this.authenticate(db, req, res);
      if (isAuthenticated == false) {
        // clear cookie
        res.clearCookie("company_id");
        res.clearCookie("authorization");
        res.set("Authorization", ``);

        // authentication failed
        res.status(400);
      }
    }

    // authenticated
    return isAuthenticated;
  },

  // authenticate the user
  async authenticate(db, req, res) {
    let authenticated = false;

    // get id, password, company_id
    if (req.body.id && req.headers["company_id"]) {
      // find in the db - 'user'
      let results = await db.find("user", {
        query: {
          id: req.body.id,
          inactive: { $ne: true },
          company_id: ObjectID(req.headers["company_id"]),
        },
      });
      if (results.length > 0) {
        let user = results[0];

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
        if (authenticated) {
          // create token
          let token = util.createToken({
            secret: req.app.locals.secret,
            issuer: req.get("host"),
            subject: req.headers["company_id"],
            audience: "user",
            expiresIn: "30d",
            id: user.id,
            name: user.name,
            groups: user.groups,
          });

          // set header
          res.set("Authorization", `Bearer ${token}`);

          // save token info to the global
          res.locals.token = jwt.verify(token, req.app.locals.secret);
        }
      }
    }

    return authenticated;
  },

  async isAuthenticated(db, req, res) {
    let authenticated = false;

    // do the JWT toekn thingy
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    } else if (req.query.bearer && req.method == "GET") {
      token = req.query.bearer;
    } else if (req.cookies.authorization && req.method == "GET") {
      token = req.cookies.authorization.replace("Bearer ", "");
    }

    if (token) {
      res.locals.bearer = token;

      try {
        // decoded token will be saved as token in the res.locals
        res.locals.token = jwt.verify(token, req.app.locals.secret);

        // check if the token audience is user
        if (
          res.locals.token.aud == "user" &&
          obj.get(res.locals.token, "groups")
        ) {
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
              audience: "user",
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

          // authenticated
          authenticated = true;
        }
      } catch (e) {
        authenticated = true;
        // if verification fails reassign valid token
        // temporary code
        let token = util.createToken({
          secret: req.app.locals.secret,
          issuer: req.get("host"),
          subject: req.headers["company_id"],
          audience: "user",
          expiresIn: "30d",
          id: res.locals.token.unique_name,
          name: res.locals.token.nameid,
          groups: res.locals.token.groups,
        });

        // set header
        res.set("Authorization", `Bearer ${token}`);

        // save token info to the global
        res.locals.token = jwt.verify(token, req.app.locals.secret);
        // temporary code
      }
    }

    return authenticated;
  },
};
