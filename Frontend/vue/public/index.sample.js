window.__CONFIG__ = {
    "rest": "http://localhost:8000" // host for rest url
    , "auth": "http://localhost:8000"    
    , "beforeRequest": function(config) {
        config.headers = {
            "X-App-Key": "xxxx"
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
    }
}
