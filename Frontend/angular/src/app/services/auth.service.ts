import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

// user imports
import { RestService } from './rest.service';
import { EventService } from './event.service';
import { ConfigService } from './config.service';

declare var __CONFIG__: any

@Injectable()
export class AuthService {

    constructor(
        private rest: RestService
        , private event: EventService
        , private config: ConfigService
    ) {
        // listen to events
        this.event.onEvent.subscribe(
            e => {
                if (e == 'logout') {
                    // clear localstorage
                    localStorage.clear()
                }
                else if (e == 'authenticated') {
                }
            }
        )
    }

    // save global config
    global = __CONFIG__

    // Check if the current token is authenticated
    // Auth interceptor will capture the response and check if the authentication is valid
    isAuthenticated() {
        let isValidAuth = false

        // check if the token is valid
        let token = localStorage.getItem('token')
        if (token && this.validToken(token) == true) {

            // check if the config navigation_id and the stored navigation_id matches
            let angular_navigation = localStorage.getItem('angular_navigation')
            if (angular_navigation) {
                try {
                    let nav = JSON.parse(angular_navigation)
                    if (nav[0].navigation_id == this.config.configuration._id) {
                        isValidAuth = true
                        //
                        this.validate()
                    }
                } catch (e) { }
            }
        }

        // if not valid auth then clear localstorage
        if (!isValidAuth)
            localStorage.clear()

        // return auth result
        return isValidAuth
    }



    // check exp of the token and check if it is valid
    validToken(token) {
        let isValid = false

        /// parse jwt token
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        let tokenObj = JSON.parse(window.atob(base64));
        if (tokenObj) {
            let exp = new Date(tokenObj.exp * 1000)
            if (exp > new Date())
                isValid = true
        }

        return isValid
    }

    // Process login request
    authenticate(id: string, password: string) {
        return Observable.create(observer => {
            let auth = this.global.auth
            this.rest.request(
                auth
                , { id: id, password: password }
                , "post"
            ).pipe(
                catchError(
                    // if authentication request fails
                    (err: HttpErrorResponse) => {
                        if (err.status == 403) {
                            // forbidden - matching credential doesn't exists
                            observer.next('login id/pw does not match')
                        }
                        else if (err.status == 401) {
                            observer.next('access not permitted')
                        }
                        else {
                            observer.next(err.message)
                        }

                        observer.complete()

                        return EMPTY;
                    }
                )
            ).subscribe(
                response => {
                    // set angular_navigation
                    if (response.angular_navigation)
                        localStorage.setItem('angular_navigation', JSON.stringify(response.angular_navigation))

                    if (response.angular_ui)
                        localStorage.setItem('angular_ui', JSON.stringify(response.angular_ui))

                    // authentication successful
                    observer.next(true)
                    observer.complete()
                }
            )

        })
    }

    // validate
    // send the request to refresh the navigation info
    validate() {
        this.rest.request(
            this.global.auth
            , null
            , "post"
            , { headers: new HttpHeaders({ 'Validate': 'please' }) }
        ).pipe(
            catchError(
                // if authentication request fails
                (err: HttpErrorResponse) => {
                    localStorage.clear()                    
                    return EMPTY;
                }
            )
        ).subscribe(
            response => {                
                // set angular_navigation
                if (response.angular_navigation)
                    localStorage.setItem('angular_navigation', JSON.stringify(response.angular_navigation))

                if (response.angular_ui)
                    localStorage.setItem('angular_ui', JSON.stringify(response.angular_ui))
            }
        )
    }

}
