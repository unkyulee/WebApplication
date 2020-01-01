const hash = require("../lib/hash");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongodb").ObjectID;
const strMatch = require("../lib/strMatch").strMatch;
const obj = require("object-path");

class Auth {
  async canModuleProcess(db, req, res) {
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

    // check if the request is authenticated
    let isAuthenticated = await this.isAuthenticated(db, req, res);
    if (isAuthenticated == false) {
      // if not authenticated then try to authenticate the request
      isAuthenticated = await this.authenticate(db, req, res);
      if (isAuthenticated == false) {
        // clear cookie
        res.clearCookie("company_id");
        res.clearCookie("authorization");

        // authentication failed
        res.status(403);
        return false;
      }
    }

    // check if the request is authorized
    let isAuthorized = await this.isAuthorized(db, req, res);
    if (isAuthorized == false) {
      // request is not authorized
      res.status(401);
      return false;
    }

    // authorized
    return true;
  }

  // authenticate the user
  async authenticate(db, req, res) {
    let authenticated = false;

    // get id, password, company_id
    if (req.body.id && req.headers["company_id"]) {
      // find in the db - 'core.user'
      let results = await db.find("core.user", {
        id: req.body.id,
        company_id: req.headers["company_id"]
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
          let hashedPassword = hash.hash(req.body.password);
          if (hashedPassword == user.password) {
            authenticated = true;
          }
        }

        if (authenticated) {
          // create token
          this.createToken(req, res, user.id, user.name);
        }
      }
    }

    return authenticated;
  }

  // create JWT token
  createToken(req, res, id, name) {
    var signOptions = {
      issuer: req.get("host"),
      subject: req.headers["company_id"],
      audience: req.get("host"),
      expiresIn: "30d"
    };
    var payload = {
      unique_name: id,
      nameid: name
    };
    let token = jwt.sign(payload, req.app.locals.secret, signOptions);
    res.locals.token = jwt.verify(token, req.app.locals.secret);
    res.set("Authorization", `Bearer ${token}`);
  }

  async isAuthenticated(db, req, res) {
    let authenticated = false;

    // do the JWT toekn thingy
    let token;
    if (req.headers.authorization)
      token = req.headers.authorization.replace("Bearer ", "");
    // if headers not given check cooikes - only if it is get and file download
    else if (req.cookies.authorization && req.method == "GET") {
      token = req.cookies.authorization.replace("Bearer ", "");
    } else if (req.query.bearer && req.method == "GET") {
      token = req.query.bearer;
    }

    if (token) {
      res.locals.bearer = token;

      try {
        // decoded token will be saved as token in the res.locals
        res.locals.token = jwt.verify(token, req.app.locals.secret);

        // if authentication is expiring soon then issue a new token
        // if half of the time is passed then renew
        let tokenSpan = res.locals.token.exp - res.locals.token.iat;
        let currSpan = res.locals.token.exp - new Date() / 1000;
        if (tokenSpan / 2 > currSpan) {
          // create token
          this.createToken(
            req,
            res,
            res.locals.token.unique_name,
            res.locals.token.nameid
          );
        }

        // authenticated
        authenticated = true;
      } catch (e) {
        authenticated = false;
      }
    }

    return authenticated;
  }

  async isAuthorized(db, req, res) {
    return true;
    /*
    // check decoded token
    let roleIds = res.locals.token.roles;

    // for each role - retrieve allowed and not_allowed rules
    let allowed = {};
    let not_allowed = {};
    for (let roleId of roleIds) {
      let roles = await db.find("core.role", {
        _id: ObjectID(roleId)
      });
      if (roles.length > 0) {
        let role = roles[0];

        if (role.allowed) for (let policy of role.allowed) allowed[policy] = 1;
        if (role.not_allowed)
          for (let policy of role.not_allowed) not_allowed[policy] = 1;
      }
    }

    // is it allowed ?
    let authorized = false;

    for (let policy of Object.keys(allowed)) {
      let policyUrl = policy.split(":")[0];
      let policyMethod = policy.split(":")[1];
      if (
        strMatch(req.url, policyUrl) == true &&
        strMatch(req.method, policyMethod) == true
      ) {
        authorized = true;
        break;
      }
    }

    // is it not allowed
    for (let policy of Object.keys(not_allowed)) {
      let policyUrl = policy.split(":")[0];
      let policyMethod = policy.split(":")[1];
      if (
        strMatch(req.url, policyUrl) == true &&
        strMatch(req.method, policyMethod) == true
      ) {
        authorized = false;
        break;
      }
    }

    return authorized;
    */

  }


  async getRoles(db, eq, res, user) {
    let roleIds = {};

    // get groups
    let groups = obj.get(user, "groups");
    if (groups) {
      for (let group of groups) {
        // get roles
        let roles = await db.find("core.role", {
          groups: `${group._id}`
        });
        for (let role of roles) roleIds[`${role._id}`] = 1;
      }
    }

    return Object.keys(roleIds);
  }
}

module.exports = new Auth();
