const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const axios = require("axios");
const moment = require("moment");

module.exports = {
  send: async function (db, res, req, params) {
    // retrieve server and get client secrets
    let [server] = await db.find("server", {});
    if (!server) {
      res.status(500);
      throw "send failed: server config does not found";
    }

    // retrieve google config
    let [google] = await db.find("config", {
      query: {
        type: "google",
        company_id: ObjectID(params.company_id),
      },
    });
    if (!google) {
      res.status(500);
      throw "send failed: google config does not found";
    }

    // retrieve email configuration
    let [config] = await db.find("config", {
      query: {
        type: "email",
        company_id: ObjectID(params.company_id),
      },
    });
    if (!config) {
      throw "send failed: email Config does not exists";
    }

    // check if title and body exists
    if (!params.title) {
      throw "email title missing";
    }

    if (!params.body) {
      throw "email body missing";
    }

    if (!config.email_from) {
      throw "email sender address missing";
    }

    // retrieve access token
    let token = await axios.post("https://oauth2.googleapis.com/token", {
      grant_type: "refresh_token",
      client_id: obj.get(server, "google.client_id"),
      client_secret: obj.get(server, "google.client_secret"),
      refresh_token: obj.get(google, "refresh_token"),
    });
    token = token.data;

    // send email
    let message = [
      `Content-Type: ${obj.get(
        params,
        "type",
        "text/html"
      )}; charset="UTF-8"\n`,
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      `to: ${params.to}\n`,
      `from: ${obj.get(params, "from", "")} <${config.email_from}>\n`,
      "subject: =?UTF-8?B?",
      Buffer.from(params.title, "utf-8").toString("base64"),
      "?=\n\n",
      params.body,
    ].join("");

    // sanitize the message
    message = Buffer.from(message, "utf-8")
      .toString("base64")
      .replace(/\//g, "_")
      .replace(/\+/g, "-");

    //
    try {
      let response = await axios.post(
        "https://www.googleapis.com/gmail/v1/users/me/messages/send?alt=json",
        { raw: message },
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      );
      return response.data;
    } catch (ex) {
      throw ex;
    }
  },
};
