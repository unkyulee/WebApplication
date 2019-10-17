import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import * as obj from "object-path";

// user imports
import { ConfigService } from "../../services/config.service";
import { AuthService } from "../../services/auth/auth.service";
import { EventService } from "../../services/event.service";
import { BaseComponent } from 'src/app/ui/base.component';

@Component({
  selector: "login",
  templateUrl: "./login.component.html"
})
export class LoginComponent extends BaseComponent {
  // login screen
  login: any = {};
    
  ngOnInit() {
    // load default login screen
    if(this.config.get("login"))
      this.login = this.config.get("login");

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
    // validate input
    this.data.error = "";
    for (let ui of this.login.screen) {
      let value = this.data[ui.key]; // used by the evaluation script
      if(ui.errorCondition) {
        let error = eval(ui.errorCondition);
        if (error) this.data.error += `${ui.errorMessage}\n`;
      }
    }

    // if there are error don't continue
    if (this.data.error) return;

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
}
