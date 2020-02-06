import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

// user imports
import { BaseComponent } from "src/app/ui/base.component";

@Component({
  selector: "[ui-composer-dialog]",
  templateUrl: "./ui-composer-dialog.component.html",
  styleUrls: ["./ui-composer-dialog.component.scss"]
})
export class UIComposerDialogComponent extends BaseComponent {
  constructor(public dialogRef: MatDialogRef<UIComposerDialogComponent>) {
    super();
  }

  // showLoadingBar
  showLoadingBar: boolean = false;
  isDialog: boolean = true;

  ngOnInit() {
    super.ngOnInit();

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    setTimeout(() => {this.event.send({name: 'changed'});}, 3000)
  }

  eventHandler(event) {
    if (event.name == "splash-show") {
      this.showLoadingBar = true;
    } else if (event.name == "splash-hide") {
      this.showLoadingBar = false;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.onEvent.unsubscribe();
  }
}
