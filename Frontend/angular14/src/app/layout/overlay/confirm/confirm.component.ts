// @ts-nocheck
import { Component } from "@angular/core";

import { ConfigService } from "../../../services/config.service";
import { EventService } from "../../../services/event.service";
import { NavService } from "../../../services/nav.service";
import { RestService } from "../../../services/rest.service";
import { UIService } from "../../../services/ui.service";
import { UtilService } from "../../../services/util.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "confirm",
  templateUrl: "./confirm.component.html",
  styleUrls: ["./confirm.component.css"],
})
export class ConfirmComponent {
  onEvent: Subscription;

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService,
    public ui: UIService,
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(async (event) => {
      if (event?.name == "confirm") {
        // show confirm dialog
        this.confirmationService.confirm({
          message: event.message,
          accept: event.accept,
        });
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
