import { Component, Input } from "@angular/core";
import { ConfigService } from "src/app/services/config.service";
import { EventService } from "src/app/services/event.service";
import { NavService } from "src/app/services/nav.service";
import { RestService } from "src/app/services/rest.service";
import { UtilService } from "src/app/services/util.service";

@Component({
  selector: "top-menu",
  templateUrl: "./top-menu.component.html",
})
export class TopMenuComponent {
  @Input() uiElement: any;
  @Input() data: any;
  @Input() navigations: any[];

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService
  ) {}
}
