// @ts-nocheck
import { Component, Input, OnDestroy, HostBinding } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppInjector } from "../app.component";

import { EventService } from "../services/event.service";
import { RestService } from "../services/rest.service";
import { NavService } from "../services/nav.service";
import { ConfigService } from "../services/config.service";
import { AuthService } from "../services/auth/auth.service";
import { UtilService } from "../services/util.service";
import { UIService } from "../services/ui.service";
import { WebSocketService } from "../services/websocket.service";

@Component({
  template: "",
})
export class BaseComponent {
  @Input() uiElement: any;
  @Input() data: any;

  @HostBinding("class")
  get class() {
    return obj.get(this.uiElement, "layoutClass", {});
  }

  @HostBinding("style")
  get style() {
    return obj.get(this.uiElement, "layoutStyle", {});
  }

  constructor() {
    // dependency injection
    this.router = AppInjector.get(Router);
    this.util = AppInjector.get(UtilService);
    this.event = AppInjector.get(EventService);
    this.rest = AppInjector.get(RestService);
    this.nav = AppInjector.get(NavService);
    this.ui = AppInjector.get(UIService);
    this.config = AppInjector.get(ConfigService);
    this.auth = AppInjector.get(AuthService);
    this.websocket = AppInjector.get(WebSocketService);
  }

  // global services
  public util: UtilService;
  public event: EventService;
  public rest: RestService;
  public nav: NavService;
  public ui: UIService;
  public config: ConfigService;
  public user: UserService;
  public router: Router;
  public auth: AuthService;
  public zone: NgZone;
  public permission: PermissionService;
  public websocket: WebSocketService;

  // event subscription
  onEvent: Subscription;
  onCustomEvent: Subscription;

  ngOnInit() {
    // event handler
    if (obj.has(this, "uiElement.eventHandler")) {
      this.onCustomEvent = this.event.onEvent
        .pipe(takeUntil(componentDestroyed(this)))
        .subscribe((event) => this.customEventHandler(event));
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

  //////////////////////////////////////////////////
  // BASE UTILITIES
  //////////////////////////////////////////////////

  customEventHandler(event) {
    if (this.uiElement.eventHandler) {
      try {
        eval(this.uiElement.eventHandler);
      } catch (e) {
        console.error(e, this.uiElement.eventHandler);
      }
    }
  }

  safeGet(data, path, def_value?) {
    return obj.get(data, path, def_value);
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

  async click(event, item?, script?) {
    let clickScript = script ? script : this.uiElement.click;
    if (clickScript) {
      try {
        await eval.call(this, clickScript);
      } catch (e) {
        this.event.send({ name: "error", error: `${e} ${e.stack}` });
        console.log(e);
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