import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { EMPTY } from "rxjs";

// services
import { RestService } from "src/app/services/rest.service";
import { ConfigService } from "src/app/services/config.service";
import { EventService } from "src/app/services/event.service";
import { UserService } from "../../user/user.service";

export class DefaultAuthStrategy {
  constructor(
    private rest: RestService,
    private config: ConfigService,
    private event: EventService,
    private user: UserService
  ) {}

  async login(data, isAuthenticated$) {
    return new Promise((resolve, reject) => {
      // get auth url
      let authUrl = `${this.config.get("host")}${this.config.get("url")}`;

      // request through REST
      this.rest
        .request(authUrl, data, "post", { responseType: "text" })
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
        .subscribe(() => {
          // login success
          isAuthenticated$.next(true);
          this.event.send({ name: "login-success" });
          resolve();
        });
    });
  }

  async logout(isAuthenticated$) {
    isAuthenticated$.next(false)
    // clear localstorage
    localStorage.clear();
  }

  async isAuthenticated(isAuthenticated$) {
    let isValidAuth = false;

    // check if the token is valid
    let token = localStorage.getItem("token");
    if (token && this.isValidToken(token) == true) {
      // check if the config navigation_id and the stored navigation_id matches
      if (this.user.get("sub") == this.config.get("_id")) {
        // when authentication is proven to be valid locally
        // verify with the server
        try {
          await this.login(null, isAuthenticated$);
          isValidAuth = true;
        } catch {}
      }
    }

    // if not valid auth then clear localstorage
    if (!isValidAuth) localStorage.clear();

    // return auth result
    isAuthenticated$.next(isValidAuth);
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
}
