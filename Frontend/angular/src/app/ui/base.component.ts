import { Component, Input } from "@angular/core";
import * as obj from "object-path";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AppInjector } from "../app.component";
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

@Component({
  template: ""
})
export class BaseComponent {
  constructor() {    
    // dependency injection
    this.event = AppInjector.get(EventService);
    this.rest = AppInjector.get(RestService);
    this.nav = AppInjector.get(NavService);
    this.config = AppInjector.get(ConfigService);
    this.user = AppInjector.get(UserService);
    this.db = AppInjector.get(DBService);
    this.router = AppInjector.get(Router);
    this.snackBar = AppInjector.get(MatSnackBar);
    this.cordova = AppInjector.get(CordovaService);
    this.exp = AppInjector.get(ExportService);
    this.auth = AppInjector.get(AuthService);

    // observe screen size changes
    let breakpointObserver = AppInjector.get(BreakpointObserver);
    this.isHandset$ = breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(
        map(result => {
          this.isHandset = result.matches;
          return result.matches;
        })
      );
  }

  // configuration of the ui element  
  @Input() uiElement: any;    
  @Input() data: any;

  // detect window size changes
  public isHandset: boolean;
  public isHandset$: Observable<boolean>;

  // global services
  public event: EventService;
  public rest: RestService;
  public nav: NavService;
  public config: ConfigService;
  public user: UserService;
  public db: DBService;
  public router: Router;
  public snackBar: MatSnackBar;
  public cordova: CordovaService;
  public exp: ExportService;
  public auth: AuthService;

  // event subscription
  onEvent: Subscription;
  onCustomEvent: Subscription;

  ngAfterViewInit() {
    if (obj.has(this, "uiElement.init")) {
      try {
        eval(this.uiElement.init);
      } catch (e) {
        console.error(e);
      }
    }

    // event handler    
    if (obj.has(this, "uiElement.eventHandler")) {      
      this.onCustomEvent = this.event.onEvent.subscribe(event =>
        this.customEventHandler(event)
      );
    }
  }

  ngOnDestroy() {
    if (this.onCustomEvent) this.onCustomEvent.unsubscribe();

    if (this.uiElement && this.uiElement.destroy) {
      try {
        eval(this.uiElement.destroy);
      } catch (e) {
        console.error(e);
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

  click(item?, script?) {
    let clickScript = script ? script : this.uiElement.click;
    if (clickScript) {
      try {
        eval(clickScript);
      } catch (e) {
        console.error(e);
      }
    }
  }

  
  keyupEnter() {
    if(this.uiElement.keyupEnter) {
      try {
        eval(this.uiElement.keyupEnter)      
      } catch(e) {
        console.error(e)
      }
    }
  }

  focus($event) {    
    if(this.uiElement.focus) {
      try {
        eval(this.uiElement.focus)      
      } catch(e) {
        console.error(e)
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
}
