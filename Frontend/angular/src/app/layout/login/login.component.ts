import { Component } from "@angular/core";
import * as obj from "object-path";

// user imports
import { BaseComponent } from 'src/app/ui/base.component';

@Component({
  selector: "login",
  templateUrl: "./login.component.html"
})
export class LoginComponent extends BaseComponent {
  
  ngOnInit() {
    obj.ensureExists(this, "data", {})
    obj.ensureExists(this, "uiElement", {})

    // load default login screen
    this.uiElement = this.config.get("login");

    // handle events
    this.onEvent = this.event.onEvent.subscribe(async event => {
      if (event.name == "login") {
        if(event.data) this.data = Object.assign(this.data, event.data)
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
    this.event.send("splash-show"); // show splash
    try {
      await this.auth.login(this.data);
      // login success
      this.event.send("authenticated");
    } catch (e) {
      // login error
      this.data.error = e;
    }
    this.event.send("splash-hide"); // hide splash
  }
}
