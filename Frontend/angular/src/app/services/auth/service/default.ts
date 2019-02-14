import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { RestService } from "src/app/services/rest.service";
import { EMPTY } from "rxjs";
import { ConfigService } from "src/app/services/config.service";

export class DefaultAuthStrategy {
  constructor(private rest: RestService, private config: ConfigService) {}

  async login(data) {
    return new Promise((resolve, reject) => {
      // get auth url
      let authUrl = this.config.configuration.auth;

      // request through REST
      this.rest
        .request(authUrl, data, "post")
        .pipe(
          catchError(
            // when response is not 200
            (err: HttpErrorResponse) => {
              reject(err);
              return EMPTY;
            }
          )
        )
        // when response is sucessful
        .subscribe(response => {
          // authentication successful
          resolve();
        });
    });
  }

  async logout() {
    // clear localstorage
    localStorage.clear();
  }

  async isAuthenticated() {
    let isValidAuth = false;

    // check if the token is valid
    let token = localStorage.getItem("token");
    if (token && this.validToken(token) == true) {
      // check if the config navigation_id and the stored navigation_id matches
      let angular_navigation = localStorage.getItem("angular_navigation");
      if (angular_navigation) {
        try {
          let nav = JSON.parse(angular_navigation);
          if (nav[0].navigation_id == this.config.configuration._id) {
            isValidAuth = true;
          }
        } catch (e) {}
      }
    }

    // if not valid auth then clear localstorage
    if (!isValidAuth) localStorage.clear();

    // return auth result
    return isValidAuth;
  }

  // check exp of the token and check if it is valid
  validToken(token) {
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
}
