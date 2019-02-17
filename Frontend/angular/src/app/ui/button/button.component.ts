import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

// user imports
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user/user.service";
import { RestService } from "../../services/rest.service";
import { ConfigService } from "src/app/services/config.service";
import { NavService } from "src/app/services/nav.service";

@Component({
  selector: "button-component",
  templateUrl: "./button.component.html"
})
export class ButtonComponent {
  constructor(
    public router: Router,
    public rest: RestService,
    public event: EventService, // these are used by the user code
    public user: UserService, // these are used by the user code
    public snackBar: MatSnackBar, // userd in user code
    public config: ConfigService,
    public nav: NavService
  ) {}

  @Input() uiElement: any;
  @Input() data: any;

  ngOnInit() {}

  click() {
    if (this.uiElement.script) {
      try {
        eval(this.uiElement.script);
      } catch (e) {
        console.error(e);
      }
    }
  }

  condition(uiElement) {
    let result = true;
    if (uiElement.condition) {
      try {
        result = eval(uiElement.condition);
      } catch (e) {
        console.error(e);
      }
    }
    return result;
  }

  eval(expression) {
    let v = expression;
    try {
      v = eval(expression);
    } catch (e) {}
    return v;
  }
}
