import { Component, Input } from "@angular/core";

// user Imports
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'typography'
  , templateUrl: './typography.component.html'
})
export class TypographyComponent {
  @Input() uiElement: any
  @Input() data: any

  // event subscription
  onEvent: Subscription;

  constructor(
    public config: ConfigService
    , public user: UserService
    , public event: EventService
    , public rest: RestService
    , public router: Router
  ) { }

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

  get value() {
    let v = null;

    // data driven
    if (this.data && this.uiElement.key) {
      // set value
      v = this.data[this.uiElement.key]
    }

    // fixed text
    else if (this.uiElement.text) {
      // set value
      v = this.uiElement.text
    }

    // if null then assign default
    if (!v && this.uiElement.default) {
      v = this.uiElement.default
      try { v = eval(this.uiElement.default) }
      catch (e) {}
    }

    // if format is specified
    if(this.uiElement.format) {
      try {
        v = eval(this.uiElement.format)
      }
      catch (e) { console.error(e) }
    }

    return v
  }

  set value(v) {
    if (this.data && this.uiElement.key) {
      this.data[this.uiElement.key] = v;
    }
  }

  requestDownload() {
    // download data through rest web services
    if(this.uiElement.src) {
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {}
      let method = this.uiElement.method;
      // look at query params and pass it on to the request
      let data = this.uiElement.data;
      try {
        data = eval(data)
      } catch(e) {}

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
      this.value = eval(transform);
      console.log(this.value, response, transform)
    } catch (e) {}
  }

  condition() {
    let result = true;
    if (this.uiElement.condition) {
      try {
        result = eval(this.uiElement.condition);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }

  click() {
    if(this.uiElement.click) {
      try {
        eval(this.uiElement.click)
      } catch(e) {
        console.error(e)
      }
    }
  }

}
