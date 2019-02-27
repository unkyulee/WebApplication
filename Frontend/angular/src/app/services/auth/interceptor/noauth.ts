import { HttpRequest, HttpHandler } from "@angular/common/http";

export class NoAuthInterceptorStrategy {
  constructor() {}

  // process before sending the request
  beforeRequest(req: HttpRequest<any>, next: HttpHandler) {
    return req;
  }

  // process response
  processResponse(response) {
    return response;
  }

  handleError(error, caught) {
  }
}
