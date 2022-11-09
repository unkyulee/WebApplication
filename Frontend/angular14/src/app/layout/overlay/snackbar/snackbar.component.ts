// @ts-nocheck
import { Component } from "@angular/core";
import { MessageService } from "primeng/api";

import { ConfigService } from "../../../services/config.service";
import { EventService } from "../../../services/event.service";
import { NavService } from "../../../services/nav.service";
import { RestService } from "../../../services/rest.service";
import { UIService } from "../../../services/ui.service";
import { UtilService } from "../../../services/util.service";

@Component({
  selector: "snackbar",
  templateUrl: "./snackbar.component.html",
  styleUrls: ["./snackbar.component.css"],
  providers: [MessageService],
})
export class SnackbarComponent {
  onEvent: Subscription;

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService,
    public ui: UIService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(async (event) => {
      if (event?.name == "snackbar") {
        this.messageService.add({
          severity: event.type ?? "success",
          summary: event.header ?? "",
          detail: event.message ?? "",
        });
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
