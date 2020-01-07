import { Component, HostListener } from "@angular/core";
var obj = require("object-path");

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "ui-layout",
  template: `
    <ng-container *ngFor="let ui of uiElement.screens">
      <ng-container *ngIf="condition(ui)">
        <ng-container
          ui-layout-wrapper
          [uiElement]="ui"
          [data]="data"
        ></ng-container>
      </ng-container>
    </ng-container>
  `
})
export class UILayoutComponent extends BaseComponent {
  @HostListener("click", [`$event`]) onClick(event) {
    if (obj.has(this.uiElement, "click")) {
      this.click(event, this.data, this.uiElement.click);
    }
  }
}
