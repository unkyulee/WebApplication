import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { Subscription } from "rxjs";

// user imports
import { EventService } from "../../services/event.service";
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: "ui-composer-actions",
  templateUrl: "./ui-composer-actions.component.html"
})
export class UIComposerActionsComponent {
  uiElement: any;
  data: any;

  constructor(
    private event: EventService,
    private bottomSheetRef: MatBottomSheetRef<UIComposerActionsComponent>,
    public uis: UIService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public e: any
  ) {
    this.uiElement = e.uiElement;
    this.data = e.data;
  }

  // event subscription
  onEvent: Subscription;

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event && event.name == "close-sheet") {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  close() {
    this.bottomSheetRef.dismiss();
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
