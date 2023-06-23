import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, EMPTY } from "rxjs";
import { share, takeWhile } from "rxjs/operators";

//
import { ConfigService } from "./config.service";
import { EventService } from "./event.service";

@Injectable()
export class RestService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private event: EventService
  ) {}

  // Oberservable Based Request - Caches GET
  request(url, data?, method?, options?, cached?, wait?) {
    // pass if url is not specified
    if (!url) return EMPTY;

    // process url
    url = this.processUrl(url);

    // schedule the request
    return this.schedule(url, data, method, options, cached, wait);
  }

  // Promise Based Request - Never cached
  async requestAsync(url, data?, method?, options?, cached = false, wait?) {
    return new Promise((resolve, reject) => {
      this.request(url, data, method, options, cached, wait).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // request scheduler
  // when request comes
  //  - check if there are duplicates
  //  - put in the queue
  //  - wait 300 ms before actual request
  schedule_queue = {};
  hash(value) {
    var hash = 0,
      i,
      chr;
    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return `${hash}`;
  }

  schedule(url, data?, method?, options?, cached?, wait?) {
    // check if existing request
    let cacheKey = this.hash(`${method}_${url}_${JSON.stringify(data)}`);

    // check if the observable is not yet completed
    if (this.schedule_queue[cacheKey]) {
      return this.schedule_queue[cacheKey];
    }

    // add to the schedule queue
    this.schedule_queue[cacheKey] = this.req(
      cacheKey,
      url,
      data,
      method,
      options,
      cached,
      wait
    );

    return this.schedule_queue[cacheKey];
  }

  /////////////////////////////
  // Observables
  req(cacheKey, url_passed, data?, method?, options?, cached?, wait?) {
    //
    let completed = false;
    const removeSchedule = (cacheKey, observer) => {
      // complete the observable
      observer.complete();

      // mark flag for completion
      completed = true;

      // remove from the schedule queue
      delete this.schedule_queue[cacheKey];
    };

    let observable = new Observable<any>((observer) => {
      // copy value to the observable instance
      let url = `${url_passed}`;
      let cache = `${cacheKey}`;

      switch (method) {
        case "post":
        case "POST":
          {
            this.http.post(url, data, options).subscribe(
              (res) => {
                observer.next(res);
                removeSchedule(cache, observer);
              },
              (err) => {
                observer.error(err);
                removeSchedule(cache, observer);
              }
            );
          }

          break;

        case "delete":
        case "DELETE":
          {
            // if data is given when method is get then convert it to query string
            url = this.toQueryString(url, data);
            this.http.delete(url, options).subscribe(
              (res) => {
                observer.next(res);
                removeSchedule(cache, observer);
              },
              (err) => {
                observer.error(err);
                removeSchedule(cache, observer);
              }
            );
          }
          break;

        case "put":
        case "PUT":
          {
            this.http.put(url, data, options).subscribe(
              (res) => {
                observer.next(res);
                removeSchedule(cache, observer);
              },
              (err) => {
                observer.error(err);
                removeSchedule(cache, observer);
              }
            );
          }
          break;

        case "get":
        case "GET":
        default: {
          // data is given when method is get then convert it to query string
          let response = {};
          url = this.toQueryString(url, data);

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
          this.http.get(url, options).subscribe(
            (res) => {
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
              removeSchedule(cache, observer);
            },
            (err) => {
              observer.error(err);
              removeSchedule(cache, observer);
            }
          );
        }
      }
    });

    // make it multicast
    return observable.pipe(
      takeWhile((x) => !completed),
      //delay(300),
      share()
    );
  }
  /////////////////////////////

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
}
