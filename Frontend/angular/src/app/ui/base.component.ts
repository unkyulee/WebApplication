import { Component, Input, OnDestroy, NgZone } from "@angular/core";
import { Subscription, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppInjector } from "../app.component";
import * as obj from "object-path";

import { EventService } from "../services/event.service";
import { RestService } from "../services/rest.service";
import { NavService } from "../services/nav.service";
import { ConfigService } from "../services/config.service";
import { UserService } from "../services/user/user.service";
import { DBService } from "../services/db/db.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { CordovaService } from "../services/cordova.service";
import { ExportService } from "../services/export.service";
import { AuthService } from "../services/auth/auth.service";
import { SoundService } from "../services/sound.service";
import { UIService } from "../services/ui.service";

@Component({
  template: ""
})
export class BaseComponent {
  constructor() {
    // dependency injection
    this.sound = AppInjector.get(SoundService);
    this.event = AppInjector.get(EventService);
    this.rest = AppInjector.get(RestService);
    this.nav = AppInjector.get(NavService);
    this.ui = AppInjector.get(UIService);
    this.config = AppInjector.get(ConfigService);
    this.user = AppInjector.get(UserService);
    this.db = AppInjector.get(DBService);
    this.router = AppInjector.get(Router);
    this.snackBar = AppInjector.get(MatSnackBar);
    this.cordova = AppInjector.get(CordovaService);
    this.exp = AppInjector.get(ExportService);
    this.auth = AppInjector.get(AuthService);
    this.zone = AppInjector.get(NgZone);
  }

  // configuration of the ui element
  @Input() uiElement: any;
  @Input() data: any;

  // global services
  public sound: SoundService;
  public event: EventService;
  public rest: RestService;
  public nav: NavService;
  public ui: UIService;
  public config: ConfigService;
  public user: UserService;
  public db: DBService;
  public router: Router;
  public snackBar: MatSnackBar;
  public cordova: CordovaService;
  public exp: ExportService;
  public auth: AuthService;
  public zone: NgZone;

  // event subscription
  onEvent: Subscription;
  onCustomEvent: Subscription;

  ngOnInit() {
    if (obj.has(this, "uiElement.init")) {
      try {
        eval(this.uiElement.init);
      } catch (e) {
        console.error(e);
      }
    }

    // event handler
    if (obj.has(this, "uiElement.eventHandler")) {
      this.onCustomEvent = this.event.onEvent
        .pipe(takeUntil(componentDestroyed(this)))
        .subscribe(event => this.customEventHandler(event));
    }

    // default
    this.default();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.uiElement && this.uiElement.destroy) {
      try {
        eval(this.uiElement.destroy);
      } catch (e) {
        console.error(e);
      }
    }

    if (this.onEvent) this.onEvent.unsubscribe();
    if (this.onCustomEvent) this.onCustomEvent.unsubscribe();
  }

  default() {
    if (obj.has(this.data) && obj.has(this.uiElement)) {
      if (typeof obj.get(this.data, this.uiElement.key) == "undefined") {
        // set default
        if (this.uiElement.default) {
          let defaultValue = this.uiElement.default;
          try {
            defaultValue = eval(this.uiElement.default);
          } catch (e) {
            console.error(e);
          }
          obj.set(this.data, this.uiElement.key, defaultValue);
        }
      }
    }
  }

  customEventHandler(event) {
    if (this.uiElement.eventHandler) {
      try {
        eval(this.uiElement.eventHandler);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async click(event, item?, script?) {
    let clickScript = script ? script : this.uiElement.click;
    if (clickScript) {
      try {
        await eval(clickScript);
      } catch (e) {
        console.error(e);
      }
    }
  }

  keyupEnter() {
    if (this.uiElement.keyupEnter) {
      try {
        eval(this.uiElement.keyupEnter);
      } catch (e) {
        console.error(e);
      }
    }
  }

  focus($event) {
    if (this.uiElement.focus) {
      try {
        eval(this.uiElement.focus);
      } catch (e) {
        console.error(e);
      }
    }
  }

  format(value, data) {
    try {
      value = eval(value);
    } catch (e) {
      console.error(e);
    }
    return value;
  }

  condition(uiElement) {
    let result = true;
    if (uiElement && uiElement.condition) {
      try {
        result = eval(uiElement.condition);
      } catch (e) {
        console.error(uiElement.condition, e);
        result = false;
      }
    }
    return result;
  }

  safeEval(script, data?) {
    try {
      return eval(script);
    } catch (e) {
      console.error(e);
    }

    return script;
  }

  /**
   * range()
   *
   * Returns an array of numbers between a start number and an end number incremented
   * sequentially by a fixed number(step), beginning with either the start number or
   * the end number depending on which is greater.
   *
   * @param {number} start (Required: The start number.)
   * @param {number} end (Required: The end number. If end is less than start,
   *  then the range begins with end instead of start and decrements instead of increment.)
   * @param {number} step (Optional: The fixed increment or decrement step. Defaults to 1.)
   *
   * @return {array} (An array containing the range numbers.)
   *
   * @throws {TypeError} (If any of start, end and step is not a finite number.)
   * @throws {Error} (If step is not a positive number.)
   */
  range(start, end, step = 1) {
    // Test that the first 3 arguments are finite numbers.
    // Using Array.prototype.every() and Number.isFinite().
    const allNumbers = [start, end, step].every(Number.isFinite);

    // Throw an error if any of the first 3 arguments is not a finite number.
    if (!allNumbers) {
      throw new TypeError("range() expects only finite numbers as arguments.");
    }

    // Ensure the step is always a positive number.
    if (step <= 0) {
      throw new Error("step must be a number greater than 0.");
    }

    // When the start number is greater than the end number,
    // modify the step for decrementing instead of incrementing.
    if (start > end) {
      step = -step;
    }

    // Determine the length of the array to be returned.
    // The length is incremented by 1 after Math.floor().
    // This ensures that the end number is listed if it falls within the range.
    const length = Math.floor(Math.abs((end - start) / step)) + 1;

    // Fill up a new array with the range numbers
    // using Array.from() with a mapping function.
    // Finally, return the new array.
    return Array.from(Array(length), (x, index) => start + index * step);
  }

  safeGet(data, path, def_value) {
    return obj.get(data, path, def_value);
  }

  checkPermission(nav_item) {
    let allowed = false;

    if (nav_item.permissions) {
      // give permission i.e. profile.view does profile.* allows?
      let allowed_permissions = this.config.get("permissions", []);
      //
      for (let permission of nav_item.permissions) {
        for (let allowed_permission of allowed_permissions) {
          if (this.match(permission, allowed_permission)) {
            allowed = true;
            break;
          }
        }
      }
    } else {
      // if permission is not specified then allow
      allowed = true;
    }

    return allowed;
  }

  // https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
  match(str, rule) {
    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    rule = rule.split("*").join(".*");

    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    rule = "^" + rule + "$";

    //Create a regular expression object for matching string
    var regex = new RegExp(rule);

    //Returns true if it finds a match, otherwise it returns false
    return regex.test(str);
  }
}

function componentDestroyed(component: OnDestroy) {
  const oldNgOnDestroy = component.ngOnDestroy;
  const destroyed$ = new ReplaySubject<void>(1);
  component.ngOnDestroy = () => {
    oldNgOnDestroy.apply(component);
    destroyed$.next(undefined);
    destroyed$.complete();
  };
  return destroyed$;
}
