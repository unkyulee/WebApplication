// @ts-nocheck
// services
import { RestService } from "../../rest.service";
import { EventService } from "../../event.service";
import { ConfigService } from "../../config.service";
import { NavService } from "../../nav.service";
import { UIService } from "../../ui.service";
import { CookieService } from "ngx-cookie-service";

export class DefaultAuthStrategy {
  constructor(
    private rest: RestService,
    private event: EventService,
    private config: ConfigService,
    private nav: NavService,
    private ui: UIService,
    private cookie: CookieService
  ) {}

  async login(data) {
    return new Promise((resolve, reject) => {
      // get auth url
      let authUrl = `${this.config.get("host")}${this.config.get("url")}`;

      // request through REST
      this.rest
        .request(authUrl, data, "post", { responseType: "text" })
        // when response is sucessful
        .subscribe(
          () => {
            resolve(true);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  logout() {
    // clear
    this.nav.clear();
    this.ui.clear();
    localStorage.removeItem("token");
    this.cookie.deleteAll();

    this.event.sendAsync({ name: "init" });
  }

  async isAuthenticated() {
    let isValidAuth = false;

    // check if the token is valid
    let token = localStorage.getItem("token");
    if (token && this.isValidToken(token) == true) {
      // check if the config navigation_id and the stored navigation_id matches
      if (this.get("sub") == this.config.get("_id")) {
        // when authentication is proven to be valid locally
        // verify with the server when online
        if (navigator.onLine) {
          try {
            await this.login(null);
            isValidAuth = true;
          } catch {}
        } else {
          console.log("offline authentication");
          isValidAuth = true;
        }
      }
    }

    // if not valid auth then clear localstorage
    if (!isValidAuth) localStorage.removeItem("token");

    return isValidAuth;
  }

  // check exp of the token and check if it is valid
  isValidToken(token) {
    let isValid = false;

    /// parse jwt token
    try {
      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      let tokenObj = JSON.parse(window.atob(base64));
      if (tokenObj) {
        let exp = new Date(tokenObj.exp * 1000);
        if (exp > new Date()) isValid = true;
      }
    } catch (ex) {
      console.error(ex);
    }

    return isValid;
  }

  // return user login id
  id() {
    return this.get("unique_name");
  }

  name() {
    return this.get("nameid");
  }

  roles() {
    return this.get("roles");
  }

  token() {
    return localStorage.getItem("token");
  }

  get(name) {
    let token = this.token();
    // do jwt decode
    if (token) {
      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");

      let user = JSON.parse(window.atob(base64));
      if (user) return user[name];
    }
  }
}
