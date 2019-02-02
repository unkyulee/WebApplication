window.__CONFIG__ = {
    "title": "Inspiration",
    , "rest": "" // host for rest url
    , "auth": ""    
    , "beforeRequest": function(config) {
        config.headers = {
            "X-App-Key": ""
        }
        // if token exists then add it
        let token = localStorage.getItem('token')
        if(token) config.headers['Authorization'] = `Bearer ${token}`
    }
    , "afterResponse": function(response) {
        if(response.headers && response.headers.authorization) {
            let authorization = response.headers.authorization
            let token = authorization.split(" ")[1]
            if (token) localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    },
    "login": {
        style: {
            padding: "24px"
        },
        screens: [
            {
                type: "text",                
                text: "Inspiration",
                class: {
                    "display-1": true
                },
                style: {
                    "text-align": "center",
                    "padding": "12px"
                } 
            },
            {
                type: "input",
                inputType: "email",
                prependIcon: "person",
                label: "Login",
                key: "id"
            },
            {
                type: "input",
                inputType: "password",
                prependIcon: "lock",
                label: "Password",
                key: "password"
            },
            {
                type: "button",
                screens: [
                    {
                        label: "Login",
                        color: "error",
                        action: `this.EventService.$emit('login')`
                    }
                ]
            }                
        ]
    },
    navigations: [
        {
            label: "Home",
            type: "item"
        },
        {
            label: "Sub Menu",
            type: "collapse",
            children: [
                {
                    label: "Status",
                    type: "item"
                },
                {
                    label: "Some list",
                    type: "item"
                }
            ]
        }
    ]
}