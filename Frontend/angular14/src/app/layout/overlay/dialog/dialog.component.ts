// @ts-nocheck
import { Component } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

import { ConfigService } from "../../../services/config.service";
import { EventService } from "../../../services/event.service";
import { NavService } from "../../../services/nav.service";
import { RestService } from "../../../services/rest.service";
import { UIService } from "../../../services/ui.service";
import { UtilService } from "../../../services/util.service";

@Component({
  selector: "dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
})
export class DialogComponent {
  onEvent: Subscription;

  constructor(
    public config: ConfigService,
    public event: EventService,
    public nav: NavService,
    public rest: RestService,
    public util: UtilService,
    public ui: UIService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}
}