// @ts-nocheck
import { Component } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { DialogComponent } from "./dialog/dialog.component";

import { ConfigService } from "../../services/config.service";
import { EventService } from "../../services/event.service";
import { NavService } from "../../services/nav.service";
import { RestService } from "../../services/rest.service";
import { UIService } from "../../services/ui.service";
import { UtilService } from "../../services/util.service";

@Component({
  selector: "overlay",
  templateUrl: "./overlay.component.html",
  providers: [DialogService],
})
export class OverlayComponent {
  onEvent: Subscription;

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService,
    public ui: UIService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe((event) => {
      if (event.name == "open-dialog") {
        this.openDialog(event);
      } else if (event.name == "close-dialog") {
        // close dialog
        if (this.currDialog) this.currDialog.close();
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  async openDialog(event) {
    if (!event.uiElementId) {
      //
      console.error("no uiElementId passed", event);
      return;
    }

    let uiElement = await this.ui.get(event.uiElementId);

    this.dialogService.open(DialogComponent, {
      data: {
        uiElement,
        data: event.data ?? {},
      },
      ...(event.option ?? {}),
    });

    this.event.send({ name: "changed" });
  }
}
