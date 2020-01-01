import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, distinctUntilChanged, debounceTime } from "rxjs/operators";
import * as obj from "object-path";

// get config from index.html
declare var window: any;

@Injectable()
export class ConfigService {
  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    // observe screen size changes
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        map(result => {
          this.isHandset = result.matches;
          return result.matches;
        })
      );
    this.isHandset$.subscribe();
  }

  // detect window size changes
  public isHandset: boolean;
  public isHandset$: Observable<boolean>;

  get(name, def_value?) {
    let v = null;
    if (window.__CONFIG__) v = obj.get(window.__CONFIG__, name, def_value);
    return v;
  }

  set(name, value) {
    // set default if it doesn't exists
    if (!window.__CONFIG__) window.__CONFIG__ = {};
    obj.set(window.__CONFIG__, name, value);
  }
}
