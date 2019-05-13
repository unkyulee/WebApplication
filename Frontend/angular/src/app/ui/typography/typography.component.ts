import { Component, Input } from "@angular/core";

// user Imports
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { Subscription } from "rxjs";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";
import { Router } from "@angular/router";

@Component({
  selector: "typography",
  templateUrl: "./typography.component.html"
})
export class TypographyComponent {
  @Input() uiElement: any;
  @Input() data: any;

  // event subscription
  onEvent: Subscription;

  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router
  ) {}

  ngOnInit() {
    // download data through rest web services
    this.requestDownload();

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (
        event &&
        event.name == "refresh" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        setTimeout(() => this.requestDownload(), 0);
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  _value;
  get value() {
    // fixed text
    if (this.uiElement.text) {
      // set value
      this._value = this.uiElement.text;
    }

    // key exists
    else if (this.data && this.uiElement.key) {
      // set value
      this._value = this.data[this.uiElement.key];
    }

    // if null then assign default
    if ((typeof this._value == "undefined" || this._value == null) && this.uiElement.default) {
      this._value = this.uiElement.default;
      try {
        this._value = eval(this.uiElement.default);
      } catch (e) {}
    }

    // if format is specified
    if (this.uiElement.format) {
      try {
        let v = this._value;
        this._value = eval(this.uiElement.format);
      } catch (e) {
        console.error(this.uiElement.format, e)
      }
    }

    return this._value;
  }

  requestDownload() {
    // download data through rest web services
    if (this.uiElement.src) {
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {}
      let method = this.uiElement.method;
      // look at query params and pass it on to the request
      let data = this.uiElement.data;
      try {
        data = eval(data);
      } catch (e) {}

      // send REST request
      this.event.send("splash-show"); // show splash
      this.rest
        .request(src, data, method)
        .subscribe(response => this.responseDownload(response));
    }
  }

  responseDownload(response) {
    this.event.send("splash-hide"); // hide splash

    // map data from response
    let transform = this.uiElement.transform || "response.data";
    try {
      this._value = eval(transform);
    } catch (e) {
      console.error(e);
    }
  }

  condition() {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        result = false;
      }
    }
    return result;
  }

  click() {
    if (this.uiElement.click) {
      try {
        eval(this.uiElement.click);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
