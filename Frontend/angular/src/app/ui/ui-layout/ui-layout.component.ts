import { Component, HostListener } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "ui-layout",
  template: `
    <ng-container *ngFor="let ui of uiElement.screen">
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
  @HostListener("click") onClick() {
    if (this.uiElement.click) {
      this.click(this.data, this.uiElement.click);
    }
  }
}
