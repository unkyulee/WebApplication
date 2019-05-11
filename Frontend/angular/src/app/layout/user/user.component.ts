import { Component } from "@angular/core";

// user imports
import { UserService } from "../../services/user/user.service";
import { EventService } from "../../services/event.service";
import { ConfigService } from "src/app/services/config.service";
import { CordovaService } from "src/app/services/cordova.service";
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: "user",
  templateUrl: "./user.component.html"
})
export class UserComponent {
  constructor(
    public user: UserService,
    public event: EventService,
    public config: ConfigService,
    public cordova: CordovaService
  ) {}

  data: any;

  ngOnInit() {}

  ngOnDestroy() {}

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
