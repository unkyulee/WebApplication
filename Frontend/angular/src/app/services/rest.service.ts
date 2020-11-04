import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, EMPTY } from "rxjs";

import { ConfigService } from "./config.service";

@Injectable()
export class RestService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
  }

  _isConnected = true;
  isOnline() {
    return this._isConnected;
  }

  host() {
    return this.config.get("host");
  }

  // request REST service
  request(url: string, data?, method?, options?, cached?) {
    // pass if url is not specified
    if (!url) return EMPTY;

    // convert url to full qualified name
    if (url.startsWith("http") == false) {
      //
      if (url.startsWith("/") == false) url = `/${url}`;

      // if host includes ? then replace ? in url to &
      if(this.host().includes("?")) url = url.replace('?', '&')

      url = `${this.host()}${url}`;
    }

    if(method == "jsonp") {
      const queryParams = new HttpParams({ fromObject: data });
      if (data) {
        if (url.includes("?") == false) url = `${url}?${queryParams}`;
        else url = `${url}&${queryParams}`;
      }
      return this.http.jsonp(url, options)
    }
    else if (method == "post") {
      return this.http.post(url, data, options);
    } else if (method == "put") {
      return this.http.put(url, data, options);
    } else if (method == "delete") {
      // if data is given when method is get then convert it to query string
      const queryParams = new HttpParams({ fromObject: data });

      let queryUrl: string = url;
      if (queryUrl.includes("?") == false) queryUrl = `${url}?${queryParams}`;
      else queryUrl = `${url}&${queryParams}`;

      return this.http.delete(queryUrl, options);
    } else {
      // if data is given when method is get then convert it to query string
      const queryParams = new HttpParams({ fromObject: data });
      if (data) {
        if (url.includes("?") == false) url = `${url}?${queryParams}`;
        else url = `${url}&${queryParams}`;
      }

      return Observable.create(observer => {
        let response = {};

        // check if cache exists
        if (cached == true) {
          let cachedResponse = localStorage.getItem(url);
          if (cachedResponse) {
            try {
              // return cached response
              response = JSON.parse(cachedResponse);
              observer.next(response);
            } catch {
              localStorage.removeItem(url);
            }
          }
        }

        // Ask for online result
        this.http.get(url, options).subscribe(res => {
          // save to cache
          localStorage.setItem(url, JSON.stringify(res));

          if (cached == true) {
            // check if differs from cached
            if (JSON.stringify(response) != JSON.stringify(res)) {
              // cache miss
              observer.next(res);
            }
          } else {
            observer.next(res);
          }
          // complete the subscription
          observer.complete();
        });
      });
    }
  }

  async requestAsync(url: string, data?, method?, options?, cached?) {
    return new Promise((resolve, reject) => {
      this.request(url, data, method, options, cached).subscribe(response => {
        resolve(response);
      });
    });
  }
}
