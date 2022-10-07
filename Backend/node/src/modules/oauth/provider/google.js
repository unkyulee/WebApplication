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

  //
  let url = `https://accounts.google.com/o/oauth2/v2/auth`;
  let redirect_uri = `${util.getProtocol(req)}://${req.get("host")}/google/`;
  let client_id = obj.get(server, "google.client_id");
  if (!client_id) {
    res.send("google client_id not found");
    res.end();
    return;
  }

  return `<script>window.location='${url}?response_type=code&client_id=${client_id}&scope=${req.query.scope}&redirect_uri=${redirect_uri}&state=${req.query.go}&access_type=offline&prompt=consent'</script>`;
}

async function complete(db, req, res) {
  // check company_id exists
  if (!res.locals.token.sub) {
    res.send("company_id missing");
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

  // request for token
  let response = {};
  let form = {
    code: req.query.code,
    client_id: obj.get(server, "google.client_id"),
    client_secret: obj.get(server, "google.client_secret"),
    grant_type: "authorization_code",
    redirect_uri: `${util.getProtocol(req)}://${req.get("host")}/google/`,
  };
  response = await rp({
    method: "POST",
    uri: "https://oauth2.googleapis.com/token",
    form,
  });
  response = JSON.parse(response);

  // get google config
  // save the token to the google config

  await db.update("config", {
    ...config,
    ...response,
  });

  return `<script>window.location='${req.query.state}'</script>`;
}
