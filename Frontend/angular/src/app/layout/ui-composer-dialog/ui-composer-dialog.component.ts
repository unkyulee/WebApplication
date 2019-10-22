import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

// user imports
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
    public dialogRef: MatDialogRef<UIComposerDialogComponent>    
  ) {
    super();
  }

  // showLoadingBar
  showLoadingBar: boolean = false;

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {this.event.send({name: 'changed'})}, 1000)
    
  }

  eventHandler(event) {
    if (event.name == "ui-updated") {
      // load UI when navigation changes
      if (this.uiElement) {
        this.uiElement = event.data[this.uiElement._id];
      }
    } else if (event == "splash-show") {
      this.showLoadingBar = true;
    } else if (event == "splash-hide") {
      this.showLoadingBar = false;
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }
}
