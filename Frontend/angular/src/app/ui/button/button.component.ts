import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import 'file-saver';

// user imports
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user/user.service";
import { RestService } from "../../services/rest.service";
import { ConfigService } from "src/app/services/config.service";
import { NavService } from "src/app/services/nav.service";
import { CordovaService } from 'src/app/services/cordova.service';
import { ExportService } from 'src/app/services/export.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: "button-component",
  templateUrl: "./button.component.html"
})
export class ButtonComponent extends BaseComponent {
  constructor(
    public router: Router,
    public rest: RestService,
    public event: EventService, // these are used by the user code
    public user: UserService, // these are used by the user code
    public snackBar: MatSnackBar, // userd in user code
    public config: ConfigService,
    public nav: NavService,
    public cordova: CordovaService,
    public exp: ExportService
  ) {
    super()
  }

  eval(expression) {
    let v = expression;
    try {
      v = eval(expression);
    } catch (e) {}
    return v;
  }
}
