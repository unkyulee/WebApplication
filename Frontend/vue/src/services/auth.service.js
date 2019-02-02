import axios from "axios";
import RestService from "./rest.service.js";
import ConfigService from "./config.service";

export default {
  isAuthenticated() {
    let isValidAuth = false;

    // check if the token is valid
    let token = localStorage.getItem("token");
    if (token) {
      isValidAuth = true;
    }

    // if not valid auth then clear localstorage
    if (!isValidAuth) localStorage.clear();
    return isValidAuth;
  },

  async authenticate(data) {
    let response = {};
    try {
      response = await RestService.request(
        ConfigService.get("auth"),
        data,
        "post"
      );
    } catch (e) {
      return false;
    }

    return response.status == 200;
  },

  logout() {
    localStorage.clear();
  }
};

///

// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    let beforeRequest = ConfigService.get("beforeRequest");
    if (beforeRequest) beforeRequest(config);
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    let afterResponse = ConfigService.get("afterResponse");
    if (afterResponse) afterResponse(response);
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);