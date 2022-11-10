// @ts-nocheck
import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { EventService } from "./event.service";
import { Observable } from "rxjs";
import { map, debounceTime } from "rxjs/operators";

@Injectable()
export class ConfigService {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private event: EventService
  ) {
    //
    obj.ensureExists(window, "__CONFIG__", {});
  }

  isHandset = false;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Small)
    .pipe(
      debounceTime(300),
      map((result) => {
        this.isHandset = result.matches;
        return result.matches;
      })
    );

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

  clear() {
    // this will reset the ui in the configuration
    window.__CONFIG__.ui = {};
    // clear ui cache in the localStorage
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith("http")) {
        localStorage.removeItem(localStorage.key(i));
      }
    }
  }
}
