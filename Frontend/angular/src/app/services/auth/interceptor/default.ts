import { HttpRequest, HttpHandler } from "@angular/common/http";
import { EventService } from "../../event.service";
import { ConfigService } from "../../config.service";

export class DefaultInterceptorStrategy {
  constructor(private event: EventService, private config: ConfigService) {}

  // process before sending the request
  beforeRequest(req: HttpRequest<any>, next: HttpHandler) {
    try {
      let headers = {};

      // add auth token to the request
      let token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // add navigation_id to the request
      headers["X-App-Key"] = this.config.get("_id");

      // copy headers
      for (let header of req.headers.keys())
        headers[header] = req.headers.get(header);

      req = req.clone({ setHeaders: headers });

      return req;
    } catch (e) {}
  }

  // process response
  processResponse(response) {
    // check for authentication status
    try {
      if (response.headers) {
        let authorization = response.headers.get("authorization");
        // if the authorization header has value
        if (authorization) {
          let token = authorization.split(" ")[1];
          try {
            if (token) localStorage.setItem("token", token);
          } catch {}          
        } else {
          // if the token is not present then it means unauthenticated
          // make sure that the application has unauthenticated status
          localStorage.removeItem("token");
        }
      }
    } catch (e) {
      console.error(e);
    }

    return response;
  }

  handleError(error, caught) {
    if (error.status == 403 || error.status == 401) {
      // when there is an error then logout
      this.event.send("logout");
    }

    if(this.config.get("authentication") &&
      this.config.get("authentication.error")) {
      try {
        eval(this.config.get("authentication.error"))
      } catch(e) {
        console.error(e)
      }
    }

    return error;
  }
}
