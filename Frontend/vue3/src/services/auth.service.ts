// @ts-nocheck
import rest from "./rest.service";
import config from "./config.service";
import event from "./event.service";

export default {
  async login(data) {
    let validated = false;

    // auth url
    let authUrl = `${config.get("host")}${config.get("url")}`;

    // make login request
    try {
      let response = await rest.request(authUrl, data, "post");
      if (response.status == 200) {
        validated = true;
      } else {
        validated = false;
      }
    } catch (ex) {
      // login failed
      validated = false;
      console.error(ex.stack);
    }

    return validated;
  },

  async logout() {
    localStorage.removeItem("token_public");
    event.send({ name: "init" });
  },

  async isAuthenticated() {
    let authenticated = false;

    // check if the token_public exists
    let token = localStorage.getItem("token_public");
    if (!token) {
      authenticated = false;
    } else {
      // token exists
      // validate token
      let response = await rest.request(
        `${config.get("host")}${config.get("url")}`,
        {},
        "post"
      );

      // clear if not authenticated
      if (response.status != 200) {
        // clear localStorage
        localStorage.removeItem("token_public");
      } else {
        authenticated = true;
      }
    }

    return authenticated;
  },

  client() {
    //
    let token = localStorage.getItem("token_public");

    // do jwt decode
    if (token) {
      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");

      let user = JSON.parse(window.atob(base64));

      return {
        email: user.unique_name,
        name: user.nameid,
      };
    }
  },

  async id(email) {
    let response = await rest.request(`/api/public/client?email=${email}`);

    return obj.get(response, "data.data.0.id");
  },
};
