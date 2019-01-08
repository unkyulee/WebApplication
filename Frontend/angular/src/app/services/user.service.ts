import { Injectable } from '@angular/core';
declare var __CONFIG__: any

@Injectable()
export class UserService {

    global = __CONFIG__

    // return user login id
    id() {

        // default authentication mode is jwt
        if (!this.global.auth_mode || this.global.auth_mode == 'jwt') {
            let token = localStorage.getItem('token')
            // do jwt decode
            if (token) {
                let base64Url = token.split('.')[1];
                let base64 = base64Url.replace('-', '+').replace('_', '/');

                let user = JSON.parse(window.atob(base64));
                if (user)
                    return user.unique_name
            }
        }

    }

    name() {

        // default authentication mode is jwt
        if (!this.global.auth_mode || this.global.auth_mode == 'jwt') {
            let token = localStorage.getItem('token')
            // do jwt decode
            if (token) {
                let base64Url = token.split('.')[1];
                let base64 = base64Url.replace('-', '+').replace('_', '/');

                let user = JSON.parse(window.atob(base64));
                if (user)
                    return user.nameid
            }
        }
    }

    token() {
        return localStorage.getItem('token')
    }

    roles() {

        // default authentication mode is jwt
        if (!this.global.auth_mode || this.global.auth_mode == 'jwt') {
            let token = localStorage.getItem('token')
            // do jwt decode
            if (token) {
                let base64Url = token.split('.')[1];
                let base64 = base64Url.replace('-', '+').replace('_', '/');

                let user = JSON.parse(window.atob(base64));
                if (user) {
                    if (user.roles && user.roles.constructor != Array) user.roles = [user.roles]
                    return user.roles
                }
            }
        }

        return []
    }

}
