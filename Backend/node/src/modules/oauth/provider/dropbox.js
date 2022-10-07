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

  // to make the oauth request, requires dropbox client_id
  // load server config
  let server = await db.find("server", {});
  if (server && server.length > 0) {
    server = server[0];
  } else {
    res.send("server configuration not found");
    res.end();
    return;
  }

  // form proper oauth request to dropbox
  let url = `https://www.dropbox.com/oauth2/authorize`;
  let redirect_uri = `${util.getProtocol(req)}://${req.get(
    "host"
  )}/oauth/dropbox`;
  let client_id = obj.get(server, "dropbox.client_id");
  if (!client_id) {
    res.send("dropbox client_id not found");
    res.end();
    return;
  }

  return `<script>window.location='${url}?token_access_type=offline&response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${req.query.start}'</script>`;
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

  // to make the oauth request, requires dropbox client_id
  // load server config
  let server = await db.find("server", {});
  if (server && server.length > 0) {
    server = server[0];
  } else {
    res.send("server configuration not found");
    res.end();
    return;
  }

  // save the token to the google config
  // retrieve access token from the authorization code
  try {
    let response = await axios({
      method: "post",
      url: `https://api.dropboxapi.com/oauth2/token`,
      params: {
        client_id: obj.get(server, "dropbox.client_id"),
        client_secret: obj.get(server, "dropbox.client_secret"),
        code: req.query.code,
        grant_type: "authorization_code",
        redirect_uri: `${util.getProtocol(req)}://${req.get(
          "host"
        )}/oauth/dropbox`,
      },
    });

    // write tokens on config
    if (response.status == 200) {
      // save to client's dropbox config
      let [config] = await db.find("config", {
        query: {
          company_id: ObjectID(res.locals.token.sub),
          type: "dropbox",
        },
      });
      if (!config) {
        // if it is a first time to setup the configuration
        // setup initially
        config = {
          type: "dropbox",
          company_id: ObjectID(res.locals.token.sub),
        };
      }

      // write tokens on config
      await db.update("config", {
        ...config,
        ...response.data,
        _updated: new Date(),
      });
    }
  } catch (ex) {
    console.log(ex);
  }

  return `<script>window.location='${req.query.state}'</script>`;
}
