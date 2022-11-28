// @ts-nocheck
import { Component, HostListener } from "@angular/core";
import { BaseComponent } from "../base.component";

@Component({
  selector: "layout",
  template: `
    <ng-container *ngFor="let ui of uiElement.screens">
      <ng-container
        ui-element
        *ngIf="condition(ui)"
        [uiElement]="ui"
        [data]="data"
        [style]="uiElement.layoutStyle"
        [class]="uiElement.layoutClass"
      >
      </ng-container>
    </ng-container>
  `,
})
export class LayoutComponent extends BaseComponent {
  @HostListener("click", [`$event`]) onClick(event) {
    if (obj.has(this.uiElement, "click")) {
      this.click(event, this.data, this.uiElement.click);
    }
  }
}
