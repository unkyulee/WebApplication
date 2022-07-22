import rest from "./rest.service.js";
import config from "./config.service";
import event from "./event.service";
const obj = require("object-path");
import Vue from "vue";

export default {
  client: {},
  isAuthenticated() {
    let isValidAuth = false;

    // check company_id exists
    let company_id = localStorage.getItem("company_id");
    if (!company_id) {
      localStorage.removeItem("client");
    } else if (config.get("_id") != company_id) {
      localStorage.removeItem("client");
    }

    // save company_id
    localStorage.setItem("company_id", config.get("_id"));

    // check if the token is valid
    let client = localStorage.getItem("client");
    if (client) {
      try {
        client = JSON.parse(client);
        if (client && client.id) {
          isValidAuth = true;
          this.client = client;
        }
      } catch (ex) {
        localStorage.removeItem("client");
        console.error(ex);
      }
    }

    // if not valid auth then clear localstorage
    if (!isValidAuth) localStorage.removeItem("client");

    return isValidAuth;
  },

  async login(data) {
    let response = {};
    try {
      response = await rest.request(
        `${config.get("host")}/api/public/login`,
        {
          id: obj.get(data, "id", ""),
          email: obj.get(data, "email", ""),
          password: obj.get(data, "password", ""),
        },
        "post"
      );

      // authenticate
      if (!obj.get(response, 'data.error')) {        
        Vue.set(this, 'client', response.data);        
        localStorage.setItem("client", JSON.stringify(this.client));

        event.send({ name: "login-success", data: this.data });
      }
    } catch (e) {
      console.error(e);
      return false;
    }

    return response;
  },

  async authenticate(data) {
    let response = {};
    try {
      response = await rest.request(
        `${config.get("host")}/api/public/client`,
        {
          id: obj.get(data, "id", ""),
          email: obj.get(data, "email", ""),
        },
        "get"
      );

      // authenticate
      if (response.status == 200) {
        this.client = response.data.data[0];
        localStorage.setItem("client", JSON.stringify(this.client));

        event.send({ name: data });
      }
    } catch (e) {
      console.error(e);
      return false;
    }

    return response;
  },

  logout() {
    for (let key of Object.keys(this.client)) delete this.client[key];
    localStorage.clear();
    location.reload();
    //
    event.send({ name: "data", data: { client: this.client } });
  },
};
