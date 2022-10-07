// @ts-nocheck
import rest from "./rest.service";
import config from "./config.service";

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
        // save token to localStorage - token_public
        console.log(response.data);
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

  async logout() {},

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
        //localStorage.removeItem("token_public");
      }
    }

    return authenticated;
  },
};
