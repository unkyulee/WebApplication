// @ts-nocheck
import { Component } from "@angular/core";

import { ConfigService } from "../../../services/config.service";
import { EventService } from "../../../services/event.service";
import { NavService } from "../../../services/nav.service";
import { RestService } from "../../../services/rest.service";
import { UIService } from "../../../services/ui.service";
import { UtilService } from "../../../services/util.service";

@Component({
  selector: "action-sheet",
  templateUrl: "./action-sheet.component.html",
  styleUrls: ["./action-sheet.component.css"],
})
export class ActionSheetComponent {
  onEvent: Subscription;

  uiElement: any = {};
  data: any = {};

  visible: boolean = false;

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService,
    public ui: UIService
  ) {}

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(async (event) => {
      if (event?.name == "close-sheet") {
        this.visible = false;
        this.data = {};
        this.uiElement = {};
      } else if (event?.name == "open-sheet") {
        this.visible = false;
        if (!event.uiElementId) {
          //
          console.error("no uiElementId passed", event);
          return;
        }

        this.uiElement = await this.ui.get(event.uiElementId);
        this.data = event.data;
        this.visible = true;
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
