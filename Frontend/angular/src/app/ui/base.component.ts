import { Component, Input, OnDestroy, NgZone } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppInjector } from "../app.component";
import obj from 'object-path';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

import { EventService } from "../services/event.service";
import { RestService } from "../services/rest.service";
import { NavService } from "../services/nav.service";
import { ConfigService } from "../services/config.service";
import { UserService } from "../services/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CordovaService } from "../services/cordova.service";
import { AuthService } from "../services/auth/auth.service";
import { UtilService } from "../services/util.service";
import { UIService } from "../services/ui.service";
import { PermissionService } from "../services/permission.service";

@Component({
  template: ""
})
export class BaseComponent {
  constructor() {
    // dependency injection
    this.util = AppInjector.get(UtilService);
    this.event = AppInjector.get(EventService);
    this.rest = AppInjector.get(RestService);
    this.nav = AppInjector.get(NavService);
    this.ui = AppInjector.get(UIService);
    this.config = AppInjector.get(ConfigService);
    this.user = AppInjector.get(UserService);    
    this.router = AppInjector.get(Router);
    this.snackBar = AppInjector.get(MatSnackBar);
    this.cordova = AppInjector.get(CordovaService);
    this.auth = AppInjector.get(AuthService);
    this.zone = AppInjector.get(NgZone);
    this.permission = AppInjector.get(PermissionService);
  }

  // configuration of the ui element
  @Input() uiElement: any;
  @Input() data: any;
  @Input() copy: any;

  // global services
  public util: UtilService;
  public event: EventService;
  public rest: RestService;
  public nav: NavService;
  public ui: UIService;
  public config: ConfigService;
  public user: UserService;  
  public router: Router;
  public snackBar: MatSnackBar;
  public cordova: CordovaService;
  public auth: AuthService;
  public zone: NgZone;
  public permission: PermissionService;

  // event subscription
  onEvent: Subscription;
  onCustomEvent: Subscription;

  ngOnInit() {
    // event handler
    if (obj.has(this, "uiElement.eventHandler")) {
      this.onCustomEvent = this.event.onEvent
        .pipe(takeUntil(componentDestroyed(this)))
        .subscribe(event => this.customEventHandler(event));
    }

    // default
    this.default();
  }

  ngAfterViewInit() {
    if (this.uiElement && this.uiElement.afterInit) {
      try {
        eval(this.uiElement.afterInit);
      } catch (e) {
        console.error(e, this.uiElement);
      }
    }
  }

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

  ngOnChanges() {
    if (this.uiElement && this.uiElement.onChanges) {
      try {
        eval(this.uiElement.onChanges);
      } catch (e) {
        console.error(e);
      }
    }
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
        console.error(e, this.uiElement.eventHandler);
      }
    }
  }

  async click(event, item?, script?) {
    let clickScript = script ? script : this.uiElement.click;
    if (clickScript) {
      try {
        await eval(clickScript);
      } catch (e) {
        this.event.send({name: "error", error: `${e} ${e.stack}`})
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
      console.error(e, script, data);
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

  safeGet(data, path, def_value?) {
    return obj.get(data, path, def_value);
  }

  deepCopy(obj) {
    //return obj
    if(Array.isArray(obj))
      return [...obj]
    else
      return {...obj}
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
