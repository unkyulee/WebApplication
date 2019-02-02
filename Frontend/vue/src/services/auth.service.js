import axios from 'axios';
import RestService from "./rest.service.js";

export default {
  isAuthenticated() {
    let isValidAuth = false;

    // check if the token is valid
    let token = localStorage.getItem("token");
    if (token) {
      isValidAuth = true;
    }

    // if not valid auth then clear localstorage
    if (!isValidAuth) localStorage.clear();
    return isValidAuth;
  },

  async authenticate(id, password) {
    let response = {}
    try {
      response = await RestService.request(
        window.__CONFIG__.auth
        , {id: id, password: password}
        , 'post'
      );
    } catch(e) {
      return false;
    }    
    
    return response.status == 200;
  },

  logout() {    
    localStorage.clear()
  }
};


///

// Add a request interceptor
axios.interceptors.request.use(function (config) {  
  if(window.__CONFIG__ && window.__CONFIG__.beforeRequest)
    window.__CONFIG__.beforeRequest(config)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  if(window.__CONFIG__ && window.__CONFIG__.afterResponse)
    window.__CONFIG__.afterResponse(response)
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});