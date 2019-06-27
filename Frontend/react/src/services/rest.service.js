import axios from "axios";
import ConfigService from "./config.service.js";

class RestService {
  constructor() {
    this.config = ConfigService;
  }

  async request(url, data, method, options) {
    // pass if url is not specified
    if (!url) return null;

    // convert url to full qualified name
    if (url.startsWith("http") === false) {
      if (url.startsWith("/") === false) url = `/${url}`;
      url = `${ConfigService.get("rest")}${url}`;
    }

    // create axios instance
    let instance = axios.create();

    // Pre Process
    // add X-App-Key
    instance.defaults.headers.common["X-App-Key"] = this.config.get("_id");
    // add Authorization
    let token = localStorage.getItem("token");
    if (token)
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // see if there are other headers to pass
    if(options && options.headers) {
      for(let key of Object.keys(options.headers)) {
        instance.defaults.headers.common[key] = options.headers[key]
      }
    }

    ////////////////////////////////////
    let response;
    try {
      switch (method) {
        case "post":
          response = await instance.post(url, data, options);
          break;

        case "put":
          response = await instance.put(url);
          break;

        case "delete":
          response = await instance.delete(url);
          break;

        default:
          response = await instance.get(url);
          break;
      }
    } finally {
      // if the token is not present then it means unauthenticated
      // make sure that the application has unauthenticated status
      if (!response) localStorage.removeItem("token");
      // Post Process
      else {
        if (response.headers) {
          let authorization = response.headers.authorization;
          // if the authorization header has value
          if (authorization) {
            let token = authorization.split(" ")[1];
            if (token) localStorage.setItem("token", token);
          } else {
            // if the token is not present then it means unauthenticated
            // make sure that the application has unauthenticated status
            localStorage.removeItem("token");
          }
        }
      }
    }

    return response;
  }
}

// export an instance so that it stays singletone
export default new RestService();
