import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Subscription } from "rxjs";

// user imports
import { BaseComponent } from 'src/app/ui/base.component';

@Component({
  selector: "ui-composer-actions",
  templateUrl: "./ui-composer-actions.component.html"
})
export class UIComposerActionsComponent extends BaseComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<UIComposerActionsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public e: any
  ) {
    super()

    //
    this.uiElement = e.uiElement;
    this.data = e.data;
    if(e.event) this.event = e.event;
  }

  ngOnInit() {
    super.ngOnInit();

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event && event.name == "close-sheet") {
        this.close();
      }
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  close() {
    if(this.uiElement.close) {
      try {
        eval(this.uiElement.close)
      } catch(e) {
        console.error(e)
      }
    } else {
      this.bottomSheetRef.dismiss();
    }
  }
}
