import { Component } from "@angular/core";
var obj = require("object-path");

// user imports
import { BaseComponent } from "src/app/ui/base.component";

@Component({
  selector: "login",
  templateUrl: "./login.component.html"
})
export class LoginComponent extends BaseComponent {
  async ngOnInit() {
    obj.ensureExists(this, "data", {});
    obj.ensureExists(this, "uiElement", {});

    // retreive login screen
    this.rest.request(`${this.config.get("url")}/login.config`).subscribe(r => {
      this.uiElement = r;
    });

    // handle events
    this.onEvent = this.event.onEvent.subscribe(async event => {
      if (event.name == "login") {
        if (event.data) this.data = Object.assign(this.data, event.data);
        await this.authenticate();
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  // login
  async authenticate() {
    // try login
    this.event.send({name: "splash-show"}); // show splash
    try {
      // remove error message from the data
      delete this.data.error;
      // clear localstorage
      localStorage.clear();
      // try login
      await this.auth.login(this.data);
    } catch (e) {
      // login error
      let message = obj.get(this.uiElement, `errors.${e.status}`, e.message);
      this.data.error = message;
    } finally {
      this.event.send({name: "splash-hide"}); // hide splash
    }
  }
}
