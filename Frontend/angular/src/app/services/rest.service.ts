import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, EMPTY } from "rxjs";
import { ConfigService } from "./config.service";

@Injectable()
export class RestService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  // Oberservable Based Request - Caches GET
  request(url: string, data?, method?, options?, cached?) {
    // pass if url is not specified
    if (!url) return EMPTY;

    // process url
    url = this.processUrl(url);

    // process the request
    switch (method) {
      case "post":
      case "POST": {
        return this.http.post(url, data, options);
      }

      case "delete":
      case "DELETE": {
        // if data is given when method is get then convert it to query string
        url = this.toQueryString(url, data);
        return this.http.delete(url, options);
      }

      case "put":
      case "PUT": {
        return this.http.put(url, data, options);
      }

      case "get":
      case "GET":
      default: {
        // data is given when method is get then convert it to query string
        url = this.toQueryString(url, data);
        return this.get(url, options, cached);
      }
    }
  }

  // Promise Based Request
  async requestAsync(url: string, data?, method?, options?, cached?) {
    return new Promise((resolve) => {
      this.request(url, data, method, options, false).subscribe((response) => {
        resolve(response);
      });
    });
  }

  // convert url to full qualified name
  processUrl(url) {
    if (url.startsWith("http") == false) {
      //
      if (url.startsWith("/") == false) url = `/${url}`;

      // if host includes ? then replace ? in url to &
      if (this.config.get("host", "").includes("?"))
        url = url.replace("?", "&");

      url = `${this.config.get("host", "")}${url}`;
    }

    return url;
  }

  // covert data to query string
  toQueryString(url, data) {
    if (data) {
      // if data is given when method is get then convert it to query string
      const queryParams = new HttpParams({ fromObject: data });
      if (url.includes("?") == false) url = `${url}?${queryParams}`;
      else url = `${url}&${queryParams}`;
    }
    return url;
  }

  clearCache() {
    // clear ui cache in the localStorage
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith("http")) {
        localStorage.removeItem(localStorage.key(i));
      }
    }
  }

  // returns http.get that works with cache
  get(url, options, cached) {
    return new Observable((observer) => {
      let response = {};

      // returns cached results immediately
      if (cached != false) {
        let cachedResponse = localStorage.getItem(url);
        if (cachedResponse) {
          try {
            // return cached response
            response = JSON.parse(cachedResponse);
            observer.next(response);
          } catch {
            // remove the item when parse fails
            localStorage.removeItem(url);
          }
        }
      }

      // then returns online result later
      this.http.get(url, options).subscribe((res) => {
        // save to cache
        if (cached != false) {
          try {
            //
            localStorage.setItem(url, JSON.stringify(res));
          } catch {
            // local storage can fail due to storage full
            // then clear the cache
            this.clearCache();
          }
        }

        // check if differs from cached
        if (JSON.stringify(response) != JSON.stringify(res)) {
          // cache miss
          observer.next(res);
        }

        // complete the subscription
        observer.complete();
      });
    });
  }
}
