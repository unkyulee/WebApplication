import { Component, Input } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";

// user imports
import { EventService } from "../../services/event.service";
import { UserService } from "src/app/services/user/user.service";
import { ConfigService } from "src/app/services/config.service";
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: "ui-composer-dialog",
  templateUrl: "./ui-composer-dialog.component.html",
  styleUrls: ["./ui-composer-dialog.component.scss"]
})
export class UIComposerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UIComposerDialogComponent>,
    private event: EventService,
    public user: UserService,
    public config: ConfigService,
    public uis: UIService
  ) {}

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
    if (event && event.name == "close-dialog") {
      this.close();
    } else if (event.name == "ui-updated") {
      // load UI when navigation changes
      if(this.uiElement) {
        this.uiElement = event.data[this.uiElement._id]
      }
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  close() {
    setTimeout(() => this.dialogRef.close(true), 0);
  }

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
