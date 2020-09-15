import { Component, Inject, ChangeDetectorRef } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";

// user imports
import { BaseComponent } from '../../ui/base.component';

@Component({
  selector: "ui-composer-actions",
  templateUrl: "./ui-composer-actions.component.html"
})
export class UIComposerActionsComponent extends BaseComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<UIComposerActionsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public e: any,
    public ref: ChangeDetectorRef
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
      } else if(event && event.name == 'changed') {
        this.cordova.detectChanges(this.ref)
      }
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    setTimeout(() => this.cordova.detectChanges(this.ref), 2000);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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
