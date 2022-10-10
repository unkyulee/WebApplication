const axios = require("axios");
const ObjectID = require("mongodb").ObjectID;
const util = require("../../../lib/utility");
const obj = require("object-path");

module.exports = {
  async process(db, req, res) {
    // when the query contains start
    // it is initial request for the oauth
    // gather information and form a proper dropbox connection request
    if (req.query.start) {
      return await start(db, req, res);
    }

    // this is when the page is redirected back
    // collect token information and save it to db
    return await complete(db, req, res);
  },
};
// module export ends
/////////////////////////////////////////////////////////

async function start(db, req, res) {
  // VALIDATE THE REQUEST

  // check if the login is valid when making the request
  if (!res.locals.token.sub) {
    console.error("company_id missing");
    res.status(500);
    res.end();
    return;
  }

  // load server config
  let server = await db.find("server", {});
  if (server && server.length > 0) {
    server = server[0];
  } else {
    res.send("server configuration not found");
    res.end();
    return;
  }

  // load google client id
  let client_id = obj.get(server, "google.client_id");

  // get google config
  // save the token to the google config
  // load google config
  let config = await db.find("config", {
    query: {
      company_id: ObjectID(res.locals.token.sub),
      type: "google",
    },
  });
  if (config && config.length > 0) {
    config = config[0];
  } else {
    config = {
      type: "google",
      company_id: ObjectID(res.locals.token.sub),
    };
  }

  // load scope
  let scope = obj.get(config, "scope", "");
  // check if the scope already exists
  if (scope.indexOf(req.query.scope) == -1) {
    // add scope
    scope += ` ${req.query.scope}`;
  }

  //
  let url = `https://accounts.google.com/o/oauth2/v2/auth`;
  let redirect_uri = `${util.getProtocol(req)}://${req.get(
    "host"
  )}/oauth/google`;

  if (!client_id) {
    res.send("google client_id not found");
    res.end();
    return;
  }

  return `<script>window.location='${url}?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${req.query.start}&access_type=offline&prompt=consent'</script>`;
}

async function complete(db, req, res) {
  // VALIDATE THE REQUEST

  // check if the login is valid when making the request
  if (!res.locals.token.sub) {
    console.error("company_id missing");
    res.status(500);
    res.end();
    return;
  }

  // load server config
  let server = await db.find("server", {});
  if (server && server.length > 0) {
    server = server[0];
  } else {
    res.send("server configuration not found");
    res.end();
    return;
  }

  // request for token
  let response = await axios({
    method: "post",
    url: `https://oauth2.googleapis.com/token`,
    params: {
      code: req.query.code,
      client_id: obj.get(server, "google.client_id"),
      client_secret: obj.get(server, "google.client_secret"),
      grant_type: "authorization_code",
      redirect_uri: `${util.getProtocol(req)}://${req.get(
        "host"
      )}/oauth/google`,
    },
  });
  response = response.data;

  // get google config
  // save the token to the google config
  // load google config
  let config = await db.find("config", {
    query: {
      company_id: ObjectID(res.locals.token.sub),
      type: "google",
    },
  });
  if (config && config.length > 0) {
    config = config[0];
  } else {
    config = {
      type: "google",
      company_id: ObjectID(res.locals.token.sub),
    };
  }

  await db.update("config", {
    ...config,
    ...response,
    _updated: new Date(),
  });

  return `<script>window.location='${req.query.state}'</script>`;
}
