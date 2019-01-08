import { Injectable } from '@angular/core';
import {
    HttpInterceptor
    , HttpRequest
    , HttpHandler
    , HttpEvent
    , HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventService } from './event.service';

declare var __CONFIG__: any

// Intercept REST messages and handle auth tokens and navigation id in the header
// Goal is to transparently inject and verify header information
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private event: EventService
    ) {}

    global: any = __CONFIG__

    // inject Authorization header for each request
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // do something before sending request
        req = this.beforeRequest(req, next)

        return next.handle(req).pipe(
            map(response => this.processResponse(response))
            , catchError(
                (error, caught) => {
                    this.handleError(error, caught)
                    throw error
                }
            )
        )
    }

    // add headers to the request
    beforeRequest(req: HttpRequest<any>, next: HttpHandler) {
        try {
            let headers = {}

            // add auth token to the request
            let token = localStorage.getItem('token')
            if (token) headers['Authorization'] = `Bearer ${token}`

            // add navigation_id to the request
            headers['X-App-Key'] = this.global.angular_client._id

            // copy headers
            for(let header of req.headers.keys())
                headers[header] = req.headers.get(header)

            req = req.clone({ setHeaders: headers });

            return req
        } catch(e) { console.error(e) }
    }

    // process response
    processResponse(response) {
        // check for authentication status
        try {
            if(response.headers) {
                let authorization = response.headers.get("authorization")
                // if the authorization header has value
                if (authorization) {
                    let token = authorization.split(" ")[1]
                    if (token) localStorage.setItem('token', token)
                }
                else {
                    // if the token is not present then it means unauthenticated
                    // make sure that the application has unauthenticated status
                    localStorage.removeItem('token')
                }
            }
        } catch(e) {
            console.error(e)
        }

        return response;
    }

    handleError(error, caught) {
        if(error.status == 403 || error.status == 401) {
            localStorage.removeItem('token')
            this.event.send('logout')
        }
    }

}
