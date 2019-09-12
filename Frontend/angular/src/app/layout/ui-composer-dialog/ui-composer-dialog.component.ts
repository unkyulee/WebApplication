import { Component, Input } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";

// user imports
import { EventService } from "../../services/event.service";
import { UserService } from "src/app/services/user/user.service";
import { ConfigService } from "src/app/services/config.service";
import { UIService } from "src/app/services/ui.service";
import { BaseComponent } from "src/app/ui/base.component";

@Component({
  selector: "[ui-composer-dialog]",
  templateUrl: "./ui-composer-dialog.component.html",
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
      }
    `
  ]
})
export class UIComposerDialogComponent extends BaseComponent {
  constructor(
    public dialogRef: MatDialogRef<UIComposerDialogComponent>,
    public event: EventService,
    public user: UserService,
    public config: ConfigService,
    public uis: UIService
  ) {
    super();
  }

  @Input() uiElement: any;
  @Input() data: any = {};

  // event subscription
  onEvent: Subscription;

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  eventHandler(event) {
    if (event.name == "ui-updated") {
      // load UI when navigation changes
      if (this.uiElement) {
        this.uiElement = event.data[this.uiElement._id];
      }
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
