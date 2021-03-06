import * as obj from "object-path";
import safeEval from "safe-eval";

class DefaultAuthStrategy {
  constructor(rest, config, event) {
    this.rest = rest;
    this.config = config;
    this.event = event;
  }

  async login(data) {
    // clear localstorage
    localStorage.clear();

    let response = {};
    try {
      response = await this.rest.request(this.config.get("auth"), data, "post");
      // refresh navigation information
      this.refreshAuthentication();
    } catch (e) {
      return false;
    }

    return response.status === 200;
  }

  async logout() {
    // clear localstorage
    localStorage.clear();
  }

  async isAuthenticated() {
    let isValidAuth = false;

    // check if the token is valid
    let token = localStorage.getItem("token");
    if (token && this.isValidToken(token) === true) {
      //
      isValidAuth = true;

      // check if the config navigation_id and the stored navigation_id matches
      let angular_navigation = localStorage.getItem("angular_navigation");
      if (angular_navigation) {
        try {
          let nav = JSON.parse(angular_navigation);
          if (nav[0].navigation_id === this.config.get('_id')) {
            isValidAuth = true;
            // when authentication is proven to be valid locally
            // verify with the server
            this.refreshAuthentication();
          } else {
            // if the app is not matching then it's not valid
            isValidAuth = false;
          }
        } catch (e) {}
      } else {
        // navigation is not loaded - so load the navigation
        this.refreshAuthentication();
      }
    }

    // if not valid auth then clear localstorage
    if (!isValidAuth) localStorage.clear();

    // return auth result
    return isValidAuth;
  }

  // check exp of the token and check if it is valid
  isValidToken(token) {
    let isValid = false;

    /// parse jwt token
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace("-", "+").replace("_", "/");
    let tokenObj = JSON.parse(window.atob(base64));
    if (tokenObj) {
      let exp = new Date(tokenObj.exp * 1000);
      if (exp > new Date()) isValid = true;
    }

    return isValid;
  }

  // refresh the authentication information
  // called when isAuthenticated is called in order to verify token validity
  // and also refresh the navigation information
  async refreshAuthentication() {

    // get auth url
    let headers = { Validate: "please" };

    // see if there are any custom headers to use
    let customHeaders = this.config("authentication.customHeaders");
    if (customHeaders) {
      try {
        safeEval(customHeaders, {...this});
      } catch (e) {
        console.error(e);
      }
    }

    // request through REST
    try {
      let response = await this.rest.request(
        this.config.get("auth"),
        null,
        "post",
        { headers }
      );
      // refresh navigation information
      if (response.status === 200) {
        this.refreshNavigation(response.data);
      }
    } catch {}
  }

  // refresh navigation information
  refreshNavigation(response) {
    if (response.angular_navigation) {
      // check if angular_navigation differs from cached
      let cached = localStorage.getItem("angular_navigation");
      if (JSON.stringify(response.angular_navigation) !== cached) {
        // if the navigation is updated then send refresh signal to nav service
        this.event.send({
          name: "navigation-updated",
          data: response.angular_navigation
        });
        // save angular_navigation
        localStorage.setItem(
          "angular_navigation",
          JSON.stringify(response.angular_navigation)
        );
      }
    }

    if (response.angular_ui) {
      // check if angular_ui differs from cached
      let cached = localStorage.getItem("angular_ui");
      if (JSON.stringify(response.angular_ui) !== cached) {
        // if the navigation is updated then send refresh signal to nav service
        this.event.send({
          name: "ui-updated",
          data: response.angular_ui
        });
        // save angular_ui
        localStorage.setItem("angular_ui", JSON.stringify(response.angular_ui));
      }
    }
  }
}

export default DefaultAuthStrategy;
