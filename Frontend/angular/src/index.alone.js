__CONFIG__ = Object.assign(__CONFIG__,
    {
        "rest": "",
        "angular_client": {
            "name": "Inspiration"
        },
        authentication: {
            beforeRequest: function (req, next) {
                let headers = {}
                // add auth token to the request
                let authorization = localStorage.getItem('authorization')
                if (authorization) headers['Authorization'] = authorization

                // copy headers
                for (let header of req.headers.keys())
                    headers[header] = req.headers.get(header)

                req = req.clone({ setHeaders: headers });

                return req
            },
            processResponse: function (response) {
                if (response.headers) {
                    let token = response.headers.get("authenticationtoken")
                    // if the authorization header has value
                    if (token) {
                        localStorage.setItem('authorization', token)
                    }
                }
                return response
            },
            isAuthenticated: function () {
                return !!localStorage.getItem('authorization')
            },
            authenticate: function (context) {
                context.rest.request(
                    ""
                    , context.data
                    , "post"
                ).pipe(
                    context.catchError(
                        // if authentication request fails
                        (err) => {
                            if (err.status == 403) {
                                // forbidden - matching credential doesn't exists
                                context.observer.next('login id/pw does not match')
                            }
                            else if (err.status == 401) {
                                context.observer.next('access not permitted')
                            }
                            else {
                                context.observer.next(err.message)
                            }

                            context.observer.complete()

                            return EMPTY;
                        }
                    )
                ).subscribe(
                    response => {
                        let token = Object.assign({
                            unique_name: response.user.id,
                            nameid: response.user.name,
                            roles: response.user.RoleId
                        }, response.user)

                        // convert to base64
                        token = `xxxx.${window.btoa(JSON.stringify(token))}.xxxx`
                        localStorage.setItem('token', token)
                        localStorage.setItem('authorization', response.token)

                        // authentication successful
                        context.observer.next(true)
                        context.observer.complete()
                    }
                )
            }
        },
        angular_navigation: [
            {
                "name": "Home",
                "type": "item",
                "url": "/home",
                "uiElementIds": [
                    "home"
                ]
            }
        ],
        angular_ui: {
            "home": {
                "type": "data-table",
                "src": "``",
                "list": {
                    "method": "get",
                    "transform": "response.data",
                    "table": {
                        "columns": [
                            {
                                "key": "ID",
                                "label": "ID"
                            },
                            {
                                "key": "DESCRIZIONE",
                                "label": "Descrizione"
                            }
                        ]
                    }
                }
            }
        }
    }
)