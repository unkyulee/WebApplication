import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { EventService } from "../event.service";
import { ConfigService } from "../config.service";
import { DefaultInterceptorStrategy } from "./interceptor/default";
import { NoAuthInterceptorStrategy } from "./interceptor/noauth";

// Intercept REST messages and handle auth tokens and navigation id in the header
// Goal is to transparently inject and verify header information
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public event: EventService, private config: ConfigService) {
    // setup authentication strategy
    let strategy = this.config.get("auth");
    switch (strategy) {
      case "NoAuth":
        this.interceptorStrategy = new NoAuthInterceptorStrategy();
        break;
      default:
        this.interceptorStrategy = new DefaultInterceptorStrategy(
          event,
          config
        );
    }
  }

  // interceptor strategy object
  interceptorStrategy: any;

  // inject Authorization header for each request
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // do something before sending request
    req = this.interceptorStrategy.beforeRequest(req, next);

    return next.handle(req).pipe(
      map(response => {
        return this.interceptorStrategy.processResponse(response);
      }),
      catchError((error, caught) => {
        this.interceptorStrategy.handleError(error, caught);
        throw error;
      })
    );
  }
}
